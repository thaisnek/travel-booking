package com.example.travelweb.controller;

import com.example.travelweb.dto.request.ReviewRequest;
import com.example.travelweb.dto.response.ReviewResponse;
import com.example.travelweb.security.SecurityUtils;
import com.example.travelweb.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/can-review")
    public ResponseEntity<Boolean> canReview(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam Long userId,
            @RequestParam Long tourId) {
        SecurityUtils.requireTokenUserId(userId, jwt);
        boolean canReview = reviewService.canReview(userId, tourId);
        return ResponseEntity.ok(canReview);
    }

    @PostMapping
    public ResponseEntity<ReviewResponse> createReview(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody ReviewRequest requestDTO) {
        SecurityUtils.requireTokenUserId(requestDTO.getUserId(), jwt);
        ReviewResponse createdReview = reviewService.createReview(requestDTO);
        return ResponseEntity.ok(createdReview);
    }

    @GetMapping("/tour/{tourId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByTourId(@PathVariable Long tourId) {
        List<ReviewResponse> reviews = reviewService.getReviewsByTourId(tourId);
        return ResponseEntity.ok(reviews);
    }
}
