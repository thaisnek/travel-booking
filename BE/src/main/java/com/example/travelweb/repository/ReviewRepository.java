package com.example.travelweb.repository;

import com.example.travelweb.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByTourTourID(Long tourId);

    boolean existsByUserUserIDAndTourTourID(Long userId, Long tourId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.tour.tourID = :tourId")
    Double findAverageRatingByTourId(@Param("tourId") Long tourId);

    @Query("SELECT r.tour.tourID FROM Review r GROUP BY r.tour.tourID HAVING ROUND(AVG(r.rating)) = :star")
    List<Long> findTourIdsByAverageRating(@Param("star") Integer star);
}
