package com.example.travelweb.service;

import com.example.travelweb.dto.response.TourResponse;

import java.util.List;

public interface TourSearchService {

    List<TourResponse> searchTours(String keyword);
}
