package com.example.travelweb.controller;

import com.example.travelweb.dto.request.BookingRequest;
import com.example.travelweb.dto.response.BookingResponse;
import com.example.travelweb.dto.response.BookingTourStatusResponse;
import com.example.travelweb.security.SecurityUtils;
import com.example.travelweb.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping("/create")
    public ResponseEntity<BookingResponse> createBooking(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody BookingRequest bookingRequest) {
        SecurityUtils.requireTokenUserId(bookingRequest.getUserId(), jwt);
        BookingResponse booking = bookingService.createBooking(bookingRequest);
        return ResponseEntity.ok(booking);
    }

    @GetMapping("/tour-status")
    public ResponseEntity<BookingTourStatusResponse> getUserTourBookingStatus(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam Long userId,
            @RequestParam Long tourId) {
        SecurityUtils.requireTokenUserId(userId, jwt);
        return ResponseEntity.ok(bookingService.getUserTourBookingStatus(userId, tourId));
    }

    @PostMapping("/{bookingId}/cancel")
    public ResponseEntity<BookingResponse> cancelBooking(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long bookingId) {
        BookingResponse booking = bookingService.findById(bookingId);
        SecurityUtils.requireTokenUserId(booking.getUserId(), jwt);
        return ResponseEntity.ok(bookingService.cancelBooking(bookingId));
    }
}
