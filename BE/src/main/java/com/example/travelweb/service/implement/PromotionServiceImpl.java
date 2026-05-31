package com.example.travelweb.service.implement;

import com.example.travelweb.converter.PromotionMapper;
import com.example.travelweb.dto.request.PromotionRequest;
import com.example.travelweb.dto.request.PromotionValidateRequest;
import com.example.travelweb.dto.response.PromotionResponse;
import com.example.travelweb.dto.response.PromotionValidateResponse;
import com.example.travelweb.entity.Promotion;
import com.example.travelweb.repository.PromotionRepository;
import com.example.travelweb.service.PromotionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class PromotionServiceImpl implements PromotionService {

    private final PromotionRepository promotionRepository;
    private final PromotionMapper promotionMapper;

    @Override
    public PromotionResponse createPromotion(PromotionRequest request) {
        Promotion promotion = promotionMapper.toEntity(request);
        promotion.setCode(request.getCode().trim());
        promotion = promotionRepository.save(promotion);
        return promotionMapper.toPromotionResponse(promotion);
    }

    @Override
    public Page<PromotionResponse> getAllPromotions(Pageable pageable) {
        return promotionRepository.findAll(pageable)
                .map(promotionMapper::toPromotionResponse);
    }

    @Override
    public PromotionResponse updatePromotion(Long id, PromotionRequest request) {
        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Promotion not found with id: " + id));

        promotion.setCode(request.getCode().trim());
        promotion.setDescription(request.getDescription());
        promotion.setDiscount(request.getDiscount());
        promotion.setStartDate(request.getStartDate());
        promotion.setEndDate(request.getEndDate());
        promotion.setQuantity(request.getQuantity());

        promotion = promotionRepository.save(promotion);
        return promotionMapper.toPromotionResponse(promotion);
    }

    @Override
    public PromotionValidateResponse validatePromotion(PromotionValidateRequest request) {
        PromotionValidateResponse response = new PromotionValidateResponse();

        Promotion promotion = promotionRepository.findByCode(request.getCode().trim())
                .orElse(null);

        if (promotion == null) {
            response.setValid(false);
            response.setDiscount(0.0);
            response.setMessage("Mã khuyến mãi không tồn tại.");
            return response;
        }

        LocalDate currentDate = LocalDate.now();
        if (promotion.getStartDate().isAfter(currentDate)) {
            response.setValid(false);
            response.setDiscount(0.0);
            response.setMessage("Mã khuyến mãi chưa có hiệu lực.");
            return response;
        }
        if (promotion.getEndDate().isBefore(currentDate)) {
            response.setValid(false);
            response.setDiscount(0.0);
            response.setMessage("Mã khuyến mãi đã hết hạn.");
            return response;
        }
        if (promotion.getQuantity() <= 0) {
            response.setValid(false);
            response.setDiscount(0.0);
            response.setMessage("Mã khuyến mãi đã hết số lượng sử dụng.");
            return response;
        }

        response.setValid(true);
        response.setDiscount(promotion.getDiscount());
        response.setMessage("Mã khuyến mãi hợp lệ.");
        return response;
    }

    @Override
    public void deletePromotion(Long id) {
        promotionRepository.deleteById(id);
    }
}
