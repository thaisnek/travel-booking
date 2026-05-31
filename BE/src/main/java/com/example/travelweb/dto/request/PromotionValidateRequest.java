package com.example.travelweb.dto.request;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
public class PromotionValidateRequest {
    @NotBlank(message = "Promotion code is required")
    @Size(max = 50, message = "Promotion code must not exceed 50 characters")
    private String code;
}
