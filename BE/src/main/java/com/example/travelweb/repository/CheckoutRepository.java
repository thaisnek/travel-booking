package com.example.travelweb.repository;

import com.example.travelweb.entity.Booking;
import com.example.travelweb.entity.Checkout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CheckoutRepository extends JpaRepository<Checkout, Long> {
    Optional<Checkout> findByBooking(Booking booking);
    Optional<Checkout> findByTransactionID(String transactionId);

    @Query("SELECT SUM(c.amount) FROM Checkout c WHERE c.paymentStatus = 'PAID'")
    Double sumTotalRevenue();

    @Query("""
            SELECT COUNT(c) > 0
            FROM Checkout c
            WHERE c.booking.user.userID = :userId
              AND c.booking.tour.tourID = :tourId
              AND c.booking.bookingStatus = com.example.travelweb.enums.BookingStatus.CONFIRMED
              AND c.paymentStatus = 'PAID'
            """)
    boolean existsPaidConfirmedCheckoutByUserAndTour(@Param("userId") Long userId, @Param("tourId") Long tourId);
}
