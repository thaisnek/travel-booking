package com.example.travelweb.dto.request;

import lombok.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.List;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TourCreation {
    private Long tourID;

    @NotBlank(message = "Title is required")
    @Size(max = 150, message = "Title must not exceed 150 characters")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Duration is required")
    @Size(max = 50, message = "Duration must not exceed 50 characters")
    private String duration;

    @Min(value = 0, message = "Quantity must not be negative")
    private int quantity;

    @NotNull(message = "Adult price is required")
    @Positive(message = "Adult price must be greater than zero")
    private Long priceAdult;

    @NotNull(message = "Child price is required")
    @PositiveOrZero(message = "Child price must not be negative")
    private Long priceChild;

    @NotBlank(message = "Destination is required")
    @Size(max = 100, message = "Destination must not exceed 100 characters")
    private String destination;

    @NotBlank(message = "Domain is required")
    @Size(max = 100, message = "Domain must not exceed 100 characters")
    private String domain;

    @NotNull(message = "Availability is required")
    private Boolean availability;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;

    @Valid
    private List<TimelineCreation> timelines;

    @AssertTrue(message = "End date must be on or after start date")
    public boolean isDateRangeValid() {
        return startDate == null || endDate == null || !endDate.isBefore(startDate);
    }
}
