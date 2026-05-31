package com.example.travelweb.service;

import com.example.travelweb.dto.request.TourCreation;
import com.example.travelweb.dto.request.TourRequest;
import com.example.travelweb.dto.response.TourDetailResponse;
import com.example.travelweb.dto.response.TourResponse;
import com.example.travelweb.dto.response.TourResponseWrapper;
import com.example.travelweb.entity.Tour;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface TourService {


    TourDetailResponse getTourDetails(Long tourID);

    TourResponse createTour(TourCreation tourRequestDTO);

    List<TourResponse> getLimitedTours();

    void updateTourQuantity(Long tourId, int newQuantity);

    List<TourResponse> getTourRecommendations(Long tourId);

    TourResponseWrapper<List<TourResponse>> searchTours(String destination, LocalDate startDate, LocalDate endDate);

    Page<TourResponse> getAllTours(Pageable pageable);

    TourResponse updateTour(Long id, TourRequest request);

    void deleteTour(Long id);

    List<String> uploadTourImages(Long tourId, MultipartFile[] imageFiles, boolean replaceOldImages);

    Page<TourResponse> filterTours(Map<String, Object> conditions, Pageable pageable);
}
