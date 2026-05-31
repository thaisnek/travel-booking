package com.example.travelweb.controller.Admin;

import com.example.travelweb.dto.request.PromotionRequest;
import com.example.travelweb.dto.response.PromotionResponse;
import com.example.travelweb.service.PromotionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/promotions")
@RequiredArgsConstructor
public class AdminPromotionController {

    private final PromotionService promotionService;

    @PostMapping("/create")
    public PromotionResponse createPromotion(@Valid @RequestBody PromotionRequest request) {
        return promotionService.createPromotion(request);
    }

    @GetMapping
    public Page<PromotionResponse> getAllPromotions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size) {
        return promotionService.getAllPromotions(PageRequest.of(page, size));
    }

    @PutMapping("/update/{id}")
    public PromotionResponse updatePromotion(
            @PathVariable Long id,
            @Valid @RequestBody PromotionRequest request) {
        return promotionService.updatePromotion(id, request);
    }

    @DeleteMapping("/{id}")
    public void deletePromotion(@PathVariable Long id) {
        promotionService.deletePromotion(id);
    }
}
