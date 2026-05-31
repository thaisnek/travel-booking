package com.example.travelweb.service;

import com.example.travelweb.dto.request.BookingRequest;
import com.example.travelweb.dto.response.BookingResponse;
import com.example.travelweb.dto.response.BookingTourStatusResponse;
import com.example.travelweb.entity.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BookingService {
    BookingResponse createBooking(BookingRequest bookingRequestDTO);
    BookingResponse updateBookingStatus(Long bookingId, String status);
    BookingResponse confirmPaidBooking(Long bookingId);
    BookingResponse findById(Long bookingId);
    BookingTourStatusResponse getUserTourBookingStatus(Long userId, Long tourId);
    BookingResponse cancelBooking(Long bookingId);

    Page<BookingResponse> getAllBookings(Pageable pageable);

    void deleteBooking(Long id);
}
