package com.example.travelweb.converter;

import com.example.travelweb.dto.request.ReviewRequest;
import com.example.travelweb.dto.response.ReviewResponse;
import com.example.travelweb.entity.Review;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ReviewMapper {
    @Mapping(target = "tour.tourID", source = "tourId")
    @Mapping(target = "user.userID", source = "userId")
    Review toEntity(ReviewRequest requestDTO);

    @Mapping(source = "tour.tourID", target = "tourId")
    @Mapping(source = "user.userID", target = "userId")
    @Mapping(source = "reviewID", target = "reviewId")
    @Mapping(source = "user.fullName", target = "fullName")
    ReviewResponse toResponseDTO(Review review);

    List<ReviewResponse> toResponseDTOList(List<Review> reviews);
}
