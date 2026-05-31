package com.example.travelweb.service.implement;

import com.example.travelweb.converter.ReviewMapper;
import com.example.travelweb.entity.Tour;
import com.example.travelweb.repository.CheckoutRepository;
import com.example.travelweb.repository.HistoryRepository;
import com.example.travelweb.repository.ReviewRepository;
import com.example.travelweb.repository.TourRepository;
import com.example.travelweb.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class ReviewServiceImplTests {

    private ReviewRepository reviewRepository;
    private CheckoutRepository checkoutRepository;
    private TourRepository tourRepository;
    private ReviewServiceImpl reviewService;

    @BeforeEach
    void setUp() {
        reviewRepository = mock(ReviewRepository.class);
        checkoutRepository = mock(CheckoutRepository.class);
        tourRepository = mock(TourRepository.class);
        UserRepository userRepository = mock(UserRepository.class);
        ReviewMapper reviewMapper = mock(ReviewMapper.class);
        HistoryRepository historyRepository = mock(HistoryRepository.class);

        reviewService = new ReviewServiceImpl(
                reviewRepository,
                checkoutRepository,
                tourRepository,
                userRepository,
                reviewMapper,
                historyRepository
        );
    }

    @Test
    void canReviewReturnsFalseWhenUserAlreadyReviewedTour() {
        Long userId = 1L;
        Long tourId = 2L;
        Tour tour = new Tour();
        tour.setTourID(tourId);
        tour.setEndDate(LocalDate.now().minusDays(1));

        when(tourRepository.findById(tourId)).thenReturn(Optional.of(tour));
        when(reviewRepository.existsByUserUserIDAndTourTourID(userId, tourId)).thenReturn(true);

        assertThat(reviewService.canReview(userId, tourId)).isFalse();
    }

    @Test
    void canReviewReturnsTrueOnlyWhenTourEndedAndBookingHasPaidCheckout() {
        Long userId = 1L;
        Long tourId = 2L;
        Tour tour = new Tour();
        tour.setTourID(tourId);
        tour.setEndDate(LocalDate.now().minusDays(1));

        when(tourRepository.findById(tourId)).thenReturn(Optional.of(tour));
        when(reviewRepository.existsByUserUserIDAndTourTourID(userId, tourId)).thenReturn(false);
        when(checkoutRepository.existsPaidConfirmedCheckoutByUserAndTour(userId, tourId)).thenReturn(true);

        assertThat(reviewService.canReview(userId, tourId)).isTrue();
    }
}
