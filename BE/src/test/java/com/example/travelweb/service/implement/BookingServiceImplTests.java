package com.example.travelweb.service.implement;

import com.example.travelweb.dto.request.BookingRequest;
import com.example.travelweb.entity.Booking;
import com.example.travelweb.entity.Tour;
import com.example.travelweb.entity.User;
import com.example.travelweb.enums.BookingStatus;
import com.example.travelweb.repository.BookingRepository;
import com.example.travelweb.repository.TourRepository;
import com.example.travelweb.repository.UserRepository;
import com.example.travelweb.service.BookingService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@ActiveProfiles("test")
class BookingServiceImplTests {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TourRepository tourRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Test
    void createBookingRejectsDuplicatePendingBookingForSameUserAndTour() {
        String suffix = UUID.randomUUID().toString();
        User user = User.builder()
                .username("duplicate-user-" + suffix)
                .password("password")
                .email("duplicate-user-" + suffix + "@example.com")
                .build();
        user = userRepository.save(user);

        Tour tour = new Tour();
        tour.setTitle("Duplicate pending tour");
        tour.setDescription("Duplicate pending tour description");
        tour.setDuration("2N1D");
        tour.setQuantity(10);
        tour.setPriceAdult(1_000_000L);
        tour.setPriceChild(500_000L);
        tour.setDestination("Da Lat");
        tour.setDomain("Mien Trung");
        tour.setAvailability(true);
        tour.setStartDate(LocalDate.now().plusDays(1));
        tour.setEndDate(LocalDate.now().plusDays(2));
        tour = tourRepository.save(tour);

        Booking existingBooking = new Booking();
        existingBooking.setUser(user);
        existingBooking.setTour(tour);
        existingBooking.setBookingDate(LocalDateTime.now());
        existingBooking.setNumAdults(1);
        existingBooking.setNumChildren(0);
        existingBooking.setTotalPrice(1_000_000L);
        existingBooking.setFullName("Duplicate User");
        existingBooking.setEmail(user.getEmail());
        existingBooking.setPhoneNumber("0900000000");
        existingBooking.setAddress("Da Lat");
        existingBooking.setPaymentMethod("paypal");
        existingBooking.setBookingStatus(BookingStatus.PENDING);
        bookingRepository.save(existingBooking);

        BookingRequest request = BookingRequest.builder()
                .userId(user.getUserID())
                .tourId(tour.getTourID())
                .numAdults(1)
                .numChildren(0)
                .fullName("Duplicate User")
                .email(user.getEmail())
                .phoneNumber("0900000000")
                .address("Da Lat")
                .paymentMethod("paypal")
                .build();

        assertThatThrownBy(() -> bookingService.createBooking(request))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("đang chờ thanh toán");
    }

    @Test
    void createBookingRejectsZeroTotalPrice() {
        String suffix = UUID.randomUUID().toString();
        User user = User.builder()
                .username("zero-total-user-" + suffix)
                .password("password")
                .email("zero-total-user-" + suffix + "@example.com")
                .build();
        user = userRepository.save(user);

        Tour tour = new Tour();
        tour.setTitle("Zero total tour");
        tour.setDescription("Zero total tour description");
        tour.setDuration("1N");
        tour.setQuantity(10);
        tour.setPriceAdult(0L);
        tour.setPriceChild(0L);
        tour.setDestination("Ha Noi");
        tour.setDomain("Mien Bac");
        tour.setAvailability(true);
        tour.setStartDate(LocalDate.now().plusDays(1));
        tour.setEndDate(LocalDate.now().plusDays(2));
        tour = tourRepository.save(tour);

        BookingRequest request = BookingRequest.builder()
                .userId(user.getUserID())
                .tourId(tour.getTourID())
                .numAdults(1)
                .numChildren(0)
                .fullName("Zero Total User")
                .email(user.getEmail())
                .phoneNumber("0900000000")
                .address("Ha Noi")
                .paymentMethod("paypal")
                .build();

        assertThatThrownBy(() -> bookingService.createBooking(request))
                .isInstanceOf(IllegalStateException.class);
    }

    @Test
    void getUserTourBookingStatusExpiresOldPendingBooking() {
        String suffix = UUID.randomUUID().toString();
        User user = User.builder()
                .username("expired-pending-user-" + suffix)
                .password("password")
                .email("expired-pending-user-" + suffix + "@example.com")
                .build();
        user = userRepository.save(user);

        Tour tour = new Tour();
        tour.setTitle("Expired pending tour");
        tour.setDescription("Expired pending tour description");
        tour.setDuration("1N");
        tour.setQuantity(10);
        tour.setPriceAdult(1_000_000L);
        tour.setPriceChild(500_000L);
        tour.setDestination("Ha Noi");
        tour.setDomain("Mien Bac");
        tour.setAvailability(true);
        tour.setStartDate(LocalDate.now().plusDays(1));
        tour.setEndDate(LocalDate.now().plusDays(2));
        tour = tourRepository.save(tour);

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setTour(tour);
        booking.setBookingDate(LocalDateTime.now().minusHours(1));
        booking.setExpiresAt(LocalDateTime.now().minusMinutes(1));
        booking.setNumAdults(1);
        booking.setNumChildren(0);
        booking.setTotalPrice(1_000_000L);
        booking.setFullName("Expired Pending User");
        booking.setEmail(user.getEmail());
        booking.setPhoneNumber("0900000000");
        booking.setAddress("Ha Noi");
        booking.setPaymentMethod("paypal");
        booking.setBookingStatus(BookingStatus.PENDING);
        booking = bookingRepository.save(booking);

        assertThat(bookingService.getUserTourBookingStatus(user.getUserID(), tour.getTourID()).isHasPending())
                .isFalse();
        assertThat(bookingRepository.findById(booking.getBookingID()).orElseThrow().getBookingStatus())
                .isEqualTo(BookingStatus.CANCELLED);
    }

    @Test
    void updateBookingStatusRejectsManualConfirm() {
        String suffix = UUID.randomUUID().toString();
        User user = User.builder()
                .username("manual-confirm-user-" + suffix)
                .password("password")
                .email("manual-confirm-user-" + suffix + "@example.com")
                .build();
        user = userRepository.save(user);

        Tour tour = new Tour();
        tour.setTitle("Manual confirm tour");
        tour.setDescription("Manual confirm tour description");
        tour.setDuration("1N");
        tour.setQuantity(10);
        tour.setPriceAdult(1_000_000L);
        tour.setPriceChild(500_000L);
        tour.setDestination("Ha Noi");
        tour.setDomain("Mien Bac");
        tour.setAvailability(true);
        tour.setStartDate(LocalDate.now().plusDays(1));
        tour.setEndDate(LocalDate.now().plusDays(2));
        tour = tourRepository.save(tour);

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setTour(tour);
        booking.setBookingDate(LocalDateTime.now());
        booking.setExpiresAt(LocalDateTime.now().plusMinutes(30));
        booking.setNumAdults(1);
        booking.setNumChildren(0);
        booking.setTotalPrice(1_000_000L);
        booking.setFullName("Manual Confirm User");
        booking.setEmail(user.getEmail());
        booking.setPhoneNumber("0900000000");
        booking.setAddress("Ha Noi");
        booking.setPaymentMethod("paypal");
        booking.setBookingStatus(BookingStatus.PENDING);
        booking = bookingRepository.save(booking);

        Long bookingId = booking.getBookingID();
        assertThatThrownBy(() -> bookingService.updateBookingStatus(bookingId, BookingStatus.CONFIRMED.name()))
                .isInstanceOf(IllegalStateException.class);
    }
}
