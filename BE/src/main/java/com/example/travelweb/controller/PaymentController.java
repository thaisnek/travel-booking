package com.example.travelweb.controller;

import com.example.travelweb.dto.response.BookingResponse;
import com.example.travelweb.security.SecurityUtils;
import com.example.travelweb.service.BookingService;
import com.example.travelweb.service.CheckoutService;
import com.paypal.base.rest.PayPalRESTException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final CheckoutService checkoutService;
    private final BookingService bookingService;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @PostMapping("/create")
    public ResponseEntity<String> createPayment(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam Long bookingId) {
        try {
            BookingResponse booking = bookingService.findById(bookingId);
            SecurityUtils.requireTokenUserId(booking.getUserId(), jwt);
            String approvalUrl = checkoutService.initiatePayment(bookingId);
            return ResponseEntity.ok(approvalUrl);
        } catch (PayPalRESTException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/success")
    public RedirectView successPayment(
            @RequestParam("paymentId") String paymentId,
            @RequestParam("PayerID") String payerId,
            @RequestParam("bookingId") Long bookingId,
            @RequestParam(value = "paymentToken", required = false) String paymentToken) {
        try {
            checkoutService.completePayment(paymentId, payerId, bookingId, paymentToken);
            String redirectUrl = frontendUrl + "/payment/success"
                    + "?paymentId=" + paymentId
                    + "&PayerID=" + payerId
                    + "&bookingId=" + bookingId;
            return new RedirectView(redirectUrl);
        } catch (PayPalRESTException e) {
            return redirectToError(e.getMessage());
        } catch (RuntimeException e) {
            return redirectToError(e.getMessage());
        }
    }

    @GetMapping("/cancel")
    public RedirectView cancelPayment(
            @RequestParam Long bookingId,
            @RequestParam(value = "paymentToken", required = false) String paymentToken) {
        try {
            checkoutService.cancelPayment(bookingId, paymentToken);
            String url = frontendUrl + "/payment/cancel?bookingId=" + bookingId;
            return new RedirectView(url);
        } catch (RuntimeException e) {
            return redirectToError(e.getMessage());
        }
    }

    private RedirectView redirectToError(String message) {
        String encodedMessage = URLEncoder.encode(message, StandardCharsets.UTF_8);
        return new RedirectView(frontendUrl + "/error?message=" + encodedMessage);
    }
}
