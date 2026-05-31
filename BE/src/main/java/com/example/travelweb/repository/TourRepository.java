package com.example.travelweb.repository;

import com.example.travelweb.entity.Tour;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TourRepository extends JpaRepository<Tour, Long> {

    List<Tour> findByTourIDIn(List<Long> tourIds);

    List<Tour> findByTourIDInAndAvailabilityTrue(List<Long> tourIds);

    Page<Tour> findByAvailabilityTrue(Pageable pageable);

    /**
     * Pessimistic lock để tránh race condition khi tạo booking
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT t FROM Tour t WHERE t.tourID = :tourId")
    Optional<Tour> findByIdWithLock(@Param("tourId") Long tourId);

    @Query("SELECT t FROM Tour t " +
            "WHERE t.availability = true " +
            "AND (:minPrice IS NULL OR t.priceAdult >= :minPrice) " +
            "AND (:maxPrice IS NULL OR t.priceAdult <= :maxPrice) " +
            "AND (:domain IS NULL OR t.domain = :domain) " +
            "AND (:duration IS NULL OR t.duration = :duration) " +
            "AND (:tourIds IS NULL OR t.tourID IN :tourIds)")
    Page<Tour> filterTours(
            @Param("minPrice") Long minPrice,
            @Param("maxPrice") Long maxPrice,
            @Param("domain") String domain,
            @Param("duration") String duration,
            @Param("tourIds") List<Long> tourIds,
            Pageable pageable
    );

    @Query("SELECT t FROM Tour t WHERE t.availability = true AND " +
            "(:destination IS NULL OR t.destination = :destination) AND " +
            "(:startDate IS NULL OR t.startDate >= :startDate) AND " +
            "(:endDate IS NULL OR t.endDate <= :endDate)")
    List<Tour> findToursByCriteria(
            @Param("destination") String destination,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    long countByAvailabilityTrue();

    @Query("SELECT t FROM Tour t WHERE t.availability = true " +
            "AND (:excludedTourId IS NULL OR t.tourID <> :excludedTourId) " +
            "ORDER BY t.tourID DESC")
    List<Tour> findAvailableRecommendationFallback(@Param("excludedTourId") Long excludedTourId, Pageable pageable);

    @Query("SELECT t FROM Tour t WHERE t.availability = true " +
            "AND (" +
            "LOWER(t.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(t.description) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(t.destination) LIKE LOWER(CONCAT('%', :keyword, '%'))" +
            ")")
    List<Tour> searchAvailableToursFallback(@Param("keyword") String keyword, Pageable pageable);
}
