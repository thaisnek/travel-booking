package com.example.travelweb.controller.Admin;

import com.example.travelweb.dto.response.BookingResponse;
import com.example.travelweb.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/bookings")
@RequiredArgsConstructor
public class AdminBookingController {

    private final BookingService bookingService;

    @GetMapping
    public Page<BookingResponse> getAllBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return bookingService.getAllBookings(pageable);
    }

    @DeleteMapping("/{id}")
    public void deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
    }

    @PutMapping("/{id}/status")
    public BookingResponse updateBookingStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return bookingService.updateBookingStatus(id, status);
    }
}
