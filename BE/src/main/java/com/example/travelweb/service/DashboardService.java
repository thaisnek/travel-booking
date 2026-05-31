package com.example.travelweb.service;

import com.example.travelweb.dto.response.TopCustomerResponse;
import com.example.travelweb.dto.response.TopTourResponse;

import java.util.List;

public interface DashboardService {
    List<TopTourResponse> getTop5Tours();
    List<TopCustomerResponse> getTop5Customers();

    long getTotalActiveTours();

    long getTotalBookings();

    long getTotalUsers();

    double getTotalRevenue();
}
