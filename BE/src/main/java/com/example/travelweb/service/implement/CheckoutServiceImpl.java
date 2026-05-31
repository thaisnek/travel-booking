package com.example.travelweb.service.implement;

import com.example.travelweb.dto.response.CheckoutResponse;
import com.example.travelweb.entity.Booking;
import com.example.travelweb.entity.Checkout;
import com.example.travelweb.entity.History;
import com.example.travelweb.enums.ActionType;
import com.example.travelweb.enums.BookingStatus;
import com.example.travelweb.repository.BookingRepository;
import com.example.travelweb.repository.CheckoutRepository;
import com.example.travelweb.repository.HistoryRepository;
import com.example.travelweb.service.BookingService;
import com.example.travelweb.service.CheckoutService;
import com.example.travelweb.service.PayPalService;
import com.paypal.api.payments.Amount;
import com.paypal.api.payments.Links;
import com.paypal.api.payments.Payment;
import com.paypal.api.payments.Transaction;
import com.paypal.base.rest.PayPalRESTException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CheckoutServiceImpl implements CheckoutService {

    private static final Logger log = LoggerFactory.getLogger(CheckoutServiceImpl.class);

    private final BookingRepository bookingRepository;
    private final CheckoutRepository checkoutRepository;
    private final PayPalService payPalService;
    private final HistoryRepository historyRepository;
    private final BookingService bookingService;

    @Value("${app.backend-url}")
    private String backendUrl;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public String initiatePayment(Long bookingId) throws PayPalRESTException {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        if (booking.getBookingStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("Chỉ booking đang chờ thanh toán mới có thể tạo thanh toán");
        }

        if (booking.getTotalPrice() <= 0) {
            throw new IllegalStateException("Tổng tiền thanh toán phải lớn hơn 0");
        }

        String paymentToken = UUID.randomUUID().toString();
        Payment payment = payPalService.createPayment(
                bookingId,
                paymentToken,
                toUsdAmount(booking.getTotalPrice()),
                "USD",
                "Payment for booking ID: " + bookingId,
                backendUrl + "/api/payment/cancel",
                backendUrl + "/api/payment/success"
        );
        booking.setPaymentToken(paymentToken);
        booking.setPaypalPaymentId(payment.getId());
        bookingRepository.save(booking);

        for (Links link : payment.getLinks()) {
            if (link.getRel().equalsIgnoreCase("approval_url")) {
                return link.getHref();
            }
        }
        throw new PayPalRESTException("No approval URL found");
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public CheckoutResponse completePayment(String paymentId, String payerId, Long bookingId, String paymentToken) throws PayPalRESTException {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        validatePaymentToken(booking, paymentToken);

        if (booking.getPaypalPaymentId() != null && !booking.getPaypalPaymentId().equals(paymentId)) {
            throw new IllegalArgumentException("Payment id does not match booking");
        }

        Checkout existingCheckout = checkoutRepository.findByBooking(booking).orElse(null);
        if (existingCheckout != null && "PAID".equals(existingCheckout.getPaymentStatus())) {
            return toCheckoutResponse(existingCheckout);
        }

        if (booking.getBookingStatus() == BookingStatus.CANCELLED) {
            throw new IllegalStateException("Booking đã bị hủy");
        }

        if (booking.getBookingStatus() != BookingStatus.CONFIRMED) {
            bookingService.confirmPaidBooking(bookingId);
            booking = bookingRepository.findById(bookingId)
                    .orElseThrow(() -> new RuntimeException("Booking not found"));
        }

        Payment executedPayment = payPalService.executePayment(paymentId, payerId);
        validateExecutedPayment(executedPayment, booking);

        Checkout checkout = new Checkout();
        checkout.setBooking(booking);
        checkout.setPaymentMethod("paypal");
        checkout.setAmount(booking.getTotalPrice());
        checkout.setPaymentStatus("PAID");
        checkout.setTransactionID(executedPayment.getId());
        checkout.setPaymentDate(LocalDateTime.now());

        Checkout savedCheckout = checkoutRepository.save(checkout);
        bookingRepository.save(booking);

        History history = new History();
        history.setUser(booking.getUser());
        history.setTour(booking.getTour());
        history.setBooking(booking);
        history.setActionType(ActionType.PAY);
        history.setTimestamp(LocalDateTime.now());
        historyRepository.save(history);

        log.info("Payment completed: bookingId={}, transactionId={}", bookingId, executedPayment.getId());

        return toCheckoutResponse(savedCheckout);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void cancelPayment(Long bookingId, String paymentToken) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        validatePaymentToken(booking, paymentToken);

        if (checkoutRepository.findByBooking(booking)
                .filter(checkout -> "PAID".equals(checkout.getPaymentStatus()))
                .isPresent()) {
            throw new IllegalStateException("Booking đã thanh toán không thể hủy qua callback cancel");
        }

        if (booking.getBookingStatus() != BookingStatus.CANCELLED) {
            bookingService.updateBookingStatus(bookingId, BookingStatus.CANCELLED.name());
            booking = bookingRepository.findById(bookingId)
                    .orElseThrow(() -> new RuntimeException("Booking not found"));
        }
        booking.setPaymentToken(null);
        bookingRepository.save(booking);

        // Ghi lịch sử cancel
        History history = new History();
        history.setUser(booking.getUser());
        history.setTour(booking.getTour());
        history.setBooking(booking);
        history.setActionType(ActionType.CANCEL);
        history.setTimestamp(LocalDateTime.now());
        historyRepository.save(history);

        log.info("Payment cancelled: bookingId={}", bookingId);
    }

    private void validatePaymentToken(Booking booking, String paymentToken) {
        if (paymentToken == null || paymentToken.isBlank()
                || booking.getPaymentToken() == null
                || !booking.getPaymentToken().equals(paymentToken)) {
            throw new IllegalArgumentException("Invalid payment token");
        }
    }

    private double toUsdAmount(long totalPrice) {
        return BigDecimal.valueOf(totalPrice)
                .divide(BigDecimal.valueOf(23000), 2, RoundingMode.HALF_UP)
                .doubleValue();
    }

    private void validateExecutedPayment(Payment executedPayment, Booking booking) throws PayPalRESTException {
        String state = executedPayment.getState();
        if (state != null
                && !state.equalsIgnoreCase("approved")
                && !state.equalsIgnoreCase("completed")) {
            throw new PayPalRESTException("Payment was not approved");
        }

        List<Transaction> transactions = executedPayment.getTransactions();
        if (transactions == null || transactions.isEmpty()) {
            throw new PayPalRESTException("Payment has no transaction");
        }

        Amount paidAmount = transactions.get(0).getAmount();
        if (paidAmount == null) {
            throw new PayPalRESTException("Payment amount is missing");
        }

        if (!"USD".equalsIgnoreCase(paidAmount.getCurrency())) {
            throw new PayPalRESTException("Payment currency does not match");
        }

        BigDecimal expected = BigDecimal.valueOf(toUsdAmount(booking.getTotalPrice())).setScale(2, RoundingMode.HALF_UP);
        BigDecimal actual = new BigDecimal(paidAmount.getTotal()).setScale(2, RoundingMode.HALF_UP);
        if (actual.compareTo(expected) != 0) {
            throw new PayPalRESTException("Payment amount does not match booking total");
        }
    }

    private CheckoutResponse toCheckoutResponse(Checkout checkout) {
        return CheckoutResponse.builder()
                .checkoutID(checkout.getCheckoutID())
                .bookingId(checkout.getBooking().getBookingID())
                .paymentMethod(checkout.getPaymentMethod())
                .amount((long) checkout.getAmount())
                .paymentDate(checkout.getPaymentDate() != null
                        ? DateTimeFormatter.ISO_LOCAL_DATE_TIME.format(checkout.getPaymentDate())
                        : null)
                .paymentStatus(checkout.getPaymentStatus())
                .transactionID(checkout.getTransactionID())
                .build();
    }
}
