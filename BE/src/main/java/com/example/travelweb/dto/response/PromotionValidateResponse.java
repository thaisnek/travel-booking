package com.example.travelweb.dto.response;

import lombok.Data;

@Data
public class PromotionValidateResponse {
    private boolean valid;
    private double discount;
    private String message;
}
