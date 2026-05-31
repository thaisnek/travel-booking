package com.example.travelweb.repository;

import com.example.travelweb.dto.response.TopCustomerResponse;
import com.example.travelweb.dto.response.TopTourResponse;
import com.example.travelweb.entity.Booking;
import com.example.travelweb.enums.BookingStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    Booking findByBookingID(Long bookingID);

    List<Booking> findByUserUserIDAndTourTourID(Long userId, Long tourId);

    List<Booking> findByBookingStatusAndExpiresAtBefore(BookingStatus bookingStatus, LocalDateTime expiresAt);

    @Query("SELECT c.booking.tour.tourID as id, c.booking.tour.title as name, " +
            "SUM(c.booking.numAdults + c.booking.numChildren) as booked, c.booking.tour.quantity as available " +
            "FROM Checkout c " +
            "WHERE c.paymentStatus = 'PAID' " +
            "AND c.booking.bookingStatus = com.example.travelweb.enums.BookingStatus.CONFIRMED " +
            "GROUP BY c.booking.tour.tourID, c.booking.tour.title, c.booking.tour.quantity ORDER BY booked DESC")
    List<TopTourProjection> findTop5ToursByPaidCheckouts(Pageable pageable);

    @Query("SELECT c.booking.user.userID as id, c.booking.user.fullName as name, " +
            "COUNT(c.booking.bookingID) as totalPurchases, SUM(c.amount) as totalAmount " +
            "FROM Checkout c " +
            "WHERE c.paymentStatus = 'PAID' " +
            "AND c.booking.bookingStatus = com.example.travelweb.enums.BookingStatus.CONFIRMED " +
            "GROUP BY c.booking.user.userID, c.booking.user.fullName ORDER BY totalAmount DESC")
    List<TopCustomerProjection> findTop5CustomersByPaidCheckouts(Pageable pageable);


    public interface TopTourProjection {
        Long getId();
        String getName();
        Long getBooked();
        Long getAvailable();
    }

    public interface TopCustomerProjection {
        Long getId();
        String getName();
        Long getTotalPurchases();
        Long getTotalAmount();
    }
}
