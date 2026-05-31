package com.example.travelweb.dto.response;


import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class TourDetailResponse {
    private Long tourID;
    private String title;
    private String description;
    private String duration;
    private int quantity;
    private Long priceAdult;
    private Long priceChild;
    private String destination;
    private String domain;
    private Boolean availability;
    private LocalDate startDate;
    private LocalDate endDate;
    private List<TimelineResponse> timelines;
    private List<ImageResponse> images;
    private List<ReviewResponse> reviews;
    private Integer averageRating;
}
