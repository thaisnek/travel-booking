package com.example.travelweb.converter;

import com.example.travelweb.dto.request.PromotionRequest;
import com.example.travelweb.dto.response.PromotionResponse;
import com.example.travelweb.entity.Promotion;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PromotionMapper {
    PromotionResponse toPromotionResponse(Promotion promotion);

    List<PromotionResponse> toPromotionResponseList(List<Promotion> promotions);

    Promotion toEntity(PromotionRequest request);
}
