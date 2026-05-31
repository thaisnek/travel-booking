package com.example.travelweb.controller;

import com.example.travelweb.dto.request.PromotionValidateRequest;
import com.example.travelweb.dto.response.PromotionValidateResponse;
import com.example.travelweb.service.PromotionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/promotions")
@RequiredArgsConstructor
public class PromotionController {

    private final PromotionService promotionService;

    @PostMapping("/validate")
    public ResponseEntity<PromotionValidateResponse> validatePromotion(@Valid @RequestBody PromotionValidateRequest request) {
        PromotionValidateResponse response = promotionService.validatePromotion(request);
        return ResponseEntity.ok(response);
    }
}
