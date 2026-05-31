package com.example.travelweb.service.implement;

import com.example.travelweb.converter.ReviewMapper;
import com.example.travelweb.dto.request.ReviewRequest;
import com.example.travelweb.dto.response.ReviewResponse;
import com.example.travelweb.entity.History;
import com.example.travelweb.entity.Review;
import com.example.travelweb.entity.Tour;
import com.example.travelweb.entity.User;
import com.example.travelweb.enums.ActionType;
import com.example.travelweb.repository.CheckoutRepository;
import com.example.travelweb.repository.HistoryRepository;
import com.example.travelweb.repository.ReviewRepository;
import com.example.travelweb.repository.TourRepository;
import com.example.travelweb.repository.UserRepository;
import com.example.travelweb.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final CheckoutRepository checkoutRepository;
    private final TourRepository tourRepository;
    private final UserRepository userRepository;
    private final ReviewMapper reviewMapper;
    private final HistoryRepository historyRepository;

    public boolean canReview(Long userId, Long tourId) {
        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new RuntimeException("Tour not found"));

        if (reviewRepository.existsByUserUserIDAndTourTourID(userId, tourId)) {
            return false;
        }

        LocalDate currentDate = LocalDate.now();
        if (tour.getEndDate().isAfter(currentDate)) {
            return false;
        }

        return checkoutRepository.existsPaidConfirmedCheckoutByUserAndTour(userId, tourId);
    }

    @Transactional
    public ReviewResponse createReview(ReviewRequest requestDTO) {
        if (!canReview(requestDTO.getUserId(), requestDTO.getTourId())) {
            throw new IllegalStateException("You must complete the tour to review it");
        }
        if (reviewRepository.existsByUserUserIDAndTourTourID(requestDTO.getUserId(), requestDTO.getTourId())) {
            throw new IllegalStateException("Bạn đã đánh giá tour này");
        }

        User user = userRepository.findById(requestDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Tour tour = tourRepository.findById(requestDTO.getTourId())
                .orElseThrow(() -> new RuntimeException("Tour not found"));

        Review review = new Review();
        review.setUser(user);
        review.setTour(tour);
        review.setRating(requestDTO.getRating());
        review.setComment(requestDTO.getComment());
        review.setTimestamp(LocalDateTime.now());

        review = reviewRepository.save(review);

        History history = new History();
        history.setUser(review.getUser());
        history.setTour(review.getTour());
        history.setActionType(ActionType.REVIEW);
        history.setTimestamp(LocalDateTime.now());
        historyRepository.save(history);

        return reviewMapper.toResponseDTO(review);
    }

    public List<ReviewResponse> getReviewsByTourId(Long tourId) {
        List<Review> reviews = reviewRepository.findByTourTourID(tourId);
        return reviews.stream()
                .map(reviewMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Page<ReviewResponse> getAllReviews(Pageable pageable) {
        return reviewRepository.findAll(pageable)
                .map(reviewMapper::toResponseDTO);
    }

    @Override
    public void deleteReview(Long id) {
        reviewRepository.deleteById(id);
    }
}
