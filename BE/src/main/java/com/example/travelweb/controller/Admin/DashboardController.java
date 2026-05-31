package com.example.travelweb.controller.Admin;

import com.example.travelweb.dto.response.TopCustomerResponse;
import com.example.travelweb.dto.response.TopTourResponse;
import com.example.travelweb.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/top-tours")
    public List<TopTourResponse> getTopTours() {
        return dashboardService.getTop5Tours();
    }

    @GetMapping("/top-customers")
    public List<TopCustomerResponse> getTopCustomers() {
        return dashboardService.getTop5Customers();
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalActiveTours", dashboardService.getTotalActiveTours());
        stats.put("totalBookings", dashboardService.getTotalBookings());
        stats.put("totalUsers", dashboardService.getTotalUsers());
        stats.put("totalRevenue", dashboardService.getTotalRevenue());
        return ResponseEntity.ok(stats);
    }
}
