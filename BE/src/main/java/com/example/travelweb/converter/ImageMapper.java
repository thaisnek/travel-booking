package com.example.travelweb.converter;

import com.example.travelweb.dto.request.ImageCreation;
import com.example.travelweb.dto.response.ImageResponse;
import com.example.travelweb.entity.Image;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ImageMapper {
    @Mapping(source = "imageURL", target = "imageURL")
    @Mapping(source = "description", target = "description")
    ImageResponse toImageResponseDTO(Image image);

    List<ImageResponse> toImageResponseDTOList(List<Image> images);

    @Mapping(source = "imageURL", target = "imageURL")
    @Mapping(source = "description", target = "description")
    Image toEntity(ImageCreation imageRequestDTO);

    List<Image> toEntityList(List<ImageCreation> imageRequestDTOs);
}
