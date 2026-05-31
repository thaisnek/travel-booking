package com.example.travelweb.service;

import com.example.travelweb.dto.request.ReviewRequest;
import com.example.travelweb.dto.response.ReviewResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ReviewService {
    boolean canReview(Long userId, Long tourId);
    ReviewResponse createReview(ReviewRequest requestDTO);
    List<ReviewResponse> getReviewsByTourId(Long tourId);
    Page<ReviewResponse> getAllReviews(Pageable pageable);

    void deleteReview(Long id);
}
