package com.example.travelweb.controller;

import com.example.travelweb.dto.response.TourDetailResponse;
import com.example.travelweb.dto.response.TourResponse;
import com.example.travelweb.dto.response.TourResponseWrapper;
import com.example.travelweb.service.TourSearchService;
import com.example.travelweb.service.TourService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/tours")
@RequiredArgsConstructor
public class TourController {

    private final TourService tourService;
    private final TourSearchService tourSearchService;

    @GetMapping("/all-tours")
    public Page<TourResponse> getAllTours(
            @RequestParam(required = false) Long minPrice,
            @RequestParam(required = false) Long maxPrice,
            @RequestParam(required = false) String domain,
            @RequestParam(required = false) Integer star,
            @RequestParam(required = false) String duration,
            @RequestParam(required = false) String sorting,
            @PageableDefault(size = 9) Pageable pageable
    ) {
        Map<String, Object> conditions = new HashMap<>();
        conditions.put("minPrice", minPrice);
        conditions.put("maxPrice", maxPrice);
        conditions.put("domain", domain);
        conditions.put("star", star);
        conditions.put("duration", duration);
        conditions.put("sorting", sorting);

        return tourService.filterTours(conditions, pageable);
    }

    @GetMapping("/tour-details/{tourID}")
    public ResponseEntity<TourDetailResponse> getTourDetails(@PathVariable Long tourID) {
        TourDetailResponse tourDetails = tourService.getTourDetails(tourID);
        return ResponseEntity.ok(tourDetails);
    }

    @GetMapping("/{tourId}/recommendations")
    public List<TourResponse> getTourRecommendations(@PathVariable Long tourId) {
        return tourService.getTourRecommendations(tourId);
    }

    @GetMapping("/search")
    public TourResponseWrapper<List<TourResponse>> searchTours(
            @RequestParam(required = false) String destination,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate
    ) {
        return tourService.searchTours(destination, startDate, endDate);
    }

    @GetMapping("/search-tours")
    public ResponseEntity<?> searchToursByKeyword(@RequestParam String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Missing search query");
        }
        List<TourResponse> tours = tourSearchService.searchTours(keyword);
        return ResponseEntity.ok(tours);
    }
}
