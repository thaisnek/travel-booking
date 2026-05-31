package com.example.travelweb.service.implement;

import com.example.travelweb.converter.BookingMapper;
import com.example.travelweb.dto.request.BookingRequest;
import com.example.travelweb.dto.response.BookingResponse;
import com.example.travelweb.dto.response.BookingTourStatusResponse;
import com.example.travelweb.entity.*;
import com.example.travelweb.enums.ActionType;
import com.example.travelweb.enums.BookingStatus;
import com.example.travelweb.repository.*;
import com.example.travelweb.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private static final Logger log = LoggerFactory.getLogger(BookingServiceImpl.class);

    private final BookingRepository bookingRepository;
    private final BookingMapper bookingMapper;
    private final UserRepository userRepository;
    private final TourRepository tourRepository;
    private final HistoryRepository historyRepository;
    private final PromotionRepository promotionRepository;

    @Value("${booking.pending-expiration-minutes:30}")
    private long pendingExpirationMinutes;

    @Override
    public Page<BookingResponse> getAllBookings(Pageable pageable) {
        return bookingRepository.findAll(pageable)
                .map(bookingMapper::toResponseDto);
    }

    @Override
    @Transactional
    public BookingResponse createBooking(BookingRequest bookingRequestDTO) {
        BookingTourStatusResponse existingBookingStatus = getUserTourBookingStatus(
                bookingRequestDTO.getUserId(),
                bookingRequestDTO.getTourId()
        );
        if (existingBookingStatus.isHasPending()) {
            throw new IllegalStateException("Bạn đã có booking đang chờ thanh toán cho tour này. Vui lòng thanh toán tiếp hoặc hủy booking đó trước khi đặt mới.");
        }

        User user = userRepository.findById(bookingRequestDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Tour tour = tourRepository.findByIdWithLock(bookingRequestDTO.getTourId())
                .orElseThrow(() -> new RuntimeException("Tour not found"));

        int numRequested = bookingRequestDTO.getNumAdults() + bookingRequestDTO.getNumChildren();
        if (tour.getQuantity() < numRequested) {
            throw new IllegalStateException("Không đủ slot cho tour này");
        }

        Booking booking = bookingMapper.toEntity(bookingRequestDTO);
        booking.setUser(user);
        booking.setTour(tour);
        LocalDateTime bookingDate = LocalDateTime.now();
        booking.setBookingDate(bookingDate);
        booking.setExpiresAt(bookingDate.plusMinutes(pendingExpirationMinutes));

        long totalPrice = (tour.getPriceAdult() * bookingRequestDTO.getNumAdults()) +
                (tour.getPriceChild() * bookingRequestDTO.getNumChildren());

        String promotionCode = bookingRequestDTO.getPromotionCode();
        if (promotionCode != null && !promotionCode.isBlank()) {
            Promotion promotion = promotionRepository.findByCode(promotionCode.trim())
                    .orElseThrow(() -> new RuntimeException("Invalid promotion code"));

            if (!isPromotionUsable(promotion)) {
                throw new RuntimeException("Promotion code is not valid or expired");
            }

            double discount = promotion.getDiscount();
            long discountAmount = (long) (totalPrice * (discount / 100.0));
            totalPrice -= discountAmount;
            booking.setPromotionCode(promotion.getCode());
        }

        if (totalPrice <= 0) {
            throw new IllegalStateException("Tổng tiền booking phải lớn hơn 0");
        }

        booking.setTotalPrice(totalPrice);
        booking.setBookingStatus(BookingStatus.PENDING);

        Booking savedBooking = bookingRepository.save(booking);

        History history = new History();
        history.setUser(user);
        history.setTour(tour);
        history.setBooking(savedBooking);
        history.setActionType(ActionType.BOOK);
        history.setTimestamp(LocalDateTime.now());
        historyRepository.save(history);

        log.info("Booking created: id={}, tour={}, user={}", savedBooking.getBookingID(), tour.getTourID(), user.getUserID());

        return bookingMapper.toResponseDto(savedBooking);
    }

    @Override
    @Transactional
    public BookingResponse updateBookingStatus(Long bookingId, String status) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        BookingStatus newStatus = BookingStatus.valueOf(status);
        if (newStatus == BookingStatus.CONFIRMED && booking.getBookingStatus() != BookingStatus.CONFIRMED) {
            throw new IllegalStateException("Booking chỉ được CONFIRMED sau khi PayPal thanh toán thành công");
        }
        applyStatusTransition(booking, newStatus);
        Booking updatedBooking = bookingRepository.save(booking);
        return bookingMapper.toResponseDto(updatedBooking);
    }

    @Override
    @Transactional
    public BookingResponse confirmPaidBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        applyStatusTransition(booking, BookingStatus.CONFIRMED);
        Booking updatedBooking = bookingRepository.save(booking);
        return bookingMapper.toResponseDto(updatedBooking);
    }

    @Override
    @Transactional
    public BookingResponse findById(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        expirePendingBookingIfNeeded(booking, LocalDateTime.now());
        return bookingMapper.toResponseDto(booking);
    }

    @Override
    @Transactional
    public BookingTourStatusResponse getUserTourBookingStatus(Long userId, Long tourId) {
        List<Booking> bookings = bookingRepository.findByUserUserIDAndTourTourID(userId, tourId);
        expirePendingBookings(bookings, LocalDateTime.now());

        Long pendingBookingId = bookings.stream()
                .filter(booking -> booking.getBookingStatus() == BookingStatus.PENDING)
                .map(Booking::getBookingID)
                .findFirst()
                .orElse(null);

        Long confirmedBookingId = bookings.stream()
                .filter(booking -> booking.getBookingStatus() == BookingStatus.CONFIRMED)
                .map(Booking::getBookingID)
                .findFirst()
                .orElse(null);

        return BookingTourStatusResponse.builder()
                .hasPending(pendingBookingId != null)
                .pendingBookingId(pendingBookingId)
                .hasConfirmed(confirmedBookingId != null)
                .confirmedBookingId(confirmedBookingId)
                .build();
    }

    @Scheduled(fixedDelayString = "${booking.pending-expiration-check-ms:60000}")
    @Transactional
    public void expireExpiredPendingBookings() {
        List<Booking> expiredBookings = bookingRepository.findByBookingStatusAndExpiresAtBefore(
                BookingStatus.PENDING,
                LocalDateTime.now()
        );
        expirePendingBookings(expiredBookings, LocalDateTime.now());
    }

    @Override
    @Transactional
    public BookingResponse cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        expirePendingBookingIfNeeded(booking, LocalDateTime.now());

        if (booking.getBookingStatus() == BookingStatus.CONFIRMED) {
            throw new IllegalStateException("Booking đã thanh toán không thể hủy tại đây");
        }

        if (booking.getBookingStatus() == BookingStatus.CANCELLED) {
            return bookingMapper.toResponseDto(booking);
        }

        if (booking.getBookingStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("Chỉ booking đang chờ thanh toán mới có thể hủy");
        }

        booking.setBookingStatus(BookingStatus.CANCELLED);
        booking.setPaymentToken(null);
        booking.setPaypalPaymentId(null);
        Booking cancelledBooking = bookingRepository.save(booking);

        History history = new History();
        history.setUser(cancelledBooking.getUser());
        history.setTour(cancelledBooking.getTour());
        history.setBooking(cancelledBooking);
        history.setActionType(ActionType.CANCEL);
        history.setTimestamp(LocalDateTime.now());
        historyRepository.save(history);

        log.info("Booking cancelled by user: id={}, tour={}, user={}",
                cancelledBooking.getBookingID(),
                cancelledBooking.getTour().getTourID(),
                cancelledBooking.getUser().getUserID());

        return bookingMapper.toResponseDto(cancelledBooking);
    }

    @Override
    @Transactional
    public void deleteBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        if (booking.getBookingStatus() == BookingStatus.CONFIRMED) {
            restoreConfirmedBookingResources(booking);
        }
        bookingRepository.delete(booking);
    }

    private void applyStatusTransition(Booking booking, BookingStatus newStatus) {
        BookingStatus currentStatus = booking.getBookingStatus();
        if (currentStatus == newStatus) {
            return;
        }

        if (newStatus == BookingStatus.CONFIRMED && currentStatus != BookingStatus.CONFIRMED) {
            reserveConfirmedBookingResources(booking);
        }

        if (currentStatus == BookingStatus.CONFIRMED && newStatus != BookingStatus.CONFIRMED) {
            restoreConfirmedBookingResources(booking);
        }

        booking.setBookingStatus(newStatus);
        if (newStatus != BookingStatus.PENDING) {
            booking.setExpiresAt(null);
            booking.setPaymentToken(null);
        }
    }

    private void expirePendingBookings(List<Booking> bookings, LocalDateTime now) {
        for (Booking booking : bookings) {
            expirePendingBookingIfNeeded(booking, now);
        }
    }

    private void expirePendingBookingIfNeeded(Booking booking, LocalDateTime now) {
        if (booking.getBookingStatus() != BookingStatus.PENDING
                || booking.getExpiresAt() == null
                || booking.getExpiresAt().isAfter(now)) {
            return;
        }

        booking.setBookingStatus(BookingStatus.CANCELLED);
        booking.setExpiresAt(null);
        booking.setPaymentToken(null);
        booking.setPaypalPaymentId(null);
        Booking cancelledBooking = bookingRepository.save(booking);

        History history = new History();
        history.setUser(cancelledBooking.getUser());
        history.setTour(cancelledBooking.getTour());
        history.setBooking(cancelledBooking);
        history.setActionType(ActionType.CANCEL);
        history.setTimestamp(now);
        historyRepository.save(history);

        log.info("Expired pending booking: id={}, tour={}, user={}",
                cancelledBooking.getBookingID(),
                cancelledBooking.getTour().getTourID(),
                cancelledBooking.getUser().getUserID());
    }

    private void reserveConfirmedBookingResources(Booking booking) {
        Tour tour = tourRepository.findByIdWithLock(booking.getTour().getTourID())
                .orElseThrow(() -> new RuntimeException("Tour not found"));
        int participants = booking.getNumAdults() + booking.getNumChildren();
        if (tour.getQuantity() < participants) {
            throw new IllegalStateException("Không đủ slot cho tour này");
        }

        if (booking.getPromotionCode() != null && !booking.getPromotionCode().isBlank()) {
            Promotion promotion = promotionRepository.findByCodeWithLock(booking.getPromotionCode())
                    .orElseThrow(() -> new RuntimeException("Invalid promotion code"));
            if (!isPromotionUsable(promotion)) {
                throw new RuntimeException("Promotion code is not valid or expired");
            }
            promotion.setQuantity(promotion.getQuantity() - 1);
            promotionRepository.save(promotion);
        }

        tour.setQuantity(tour.getQuantity() - participants);
        tourRepository.save(tour);
        booking.setTour(tour);
    }

    private void restoreConfirmedBookingResources(Booking booking) {
        Tour tour = tourRepository.findByIdWithLock(booking.getTour().getTourID())
                .orElseThrow(() -> new RuntimeException("Tour not found"));
        int participants = booking.getNumAdults() + booking.getNumChildren();
        tour.setQuantity(tour.getQuantity() + participants);
        tourRepository.save(tour);
        booking.setTour(tour);

        if (booking.getPromotionCode() != null && !booking.getPromotionCode().isBlank()) {
            promotionRepository.findByCodeWithLock(booking.getPromotionCode()).ifPresent(promotion -> {
                promotion.setQuantity(promotion.getQuantity() + 1);
                promotionRepository.save(promotion);
            });
        }
    }

    private boolean isPromotionUsable(Promotion promotion) {
        LocalDate currentDate = LocalDate.now();
        return !promotion.getStartDate().isAfter(currentDate)
                && !promotion.getEndDate().isBefore(currentDate)
                && promotion.getQuantity() > 0;
    }
}
