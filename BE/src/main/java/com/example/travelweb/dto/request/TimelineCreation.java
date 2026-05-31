package com.example.travelweb.dto.request;

import lombok.Data;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
public class TimelineCreation {
    @Min(value = 1, message = "Timeline day must be at least 1")
    private long day;

    @NotBlank(message = "Timeline description is required")
    @Size(max = 2000, message = "Timeline description must not exceed 2000 characters")
    private String description;
}
