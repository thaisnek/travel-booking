package com.example.travelweb.converter;

import com.example.travelweb.dto.request.TimelineCreation;
import com.example.travelweb.dto.response.TimelineResponse;
import com.example.travelweb.entity.Timeline;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TimelineMapper {

    @Mapping(source = "day", target = "day")
    @Mapping(source = "description", target = "description")
    TimelineResponse toTimelineResponseDTO(Timeline timeline);

    List<TimelineResponse> toTimelineResponseDTOList(List<Timeline> timelines);

    @Mapping(source = "day", target = "day")
    @Mapping(source = "description", target = "description")
    Timeline toEntity(TimelineCreation timelineCreation);

    List<Timeline> toEntityList(List<TimelineCreation> timelineRequestDTOs);
}
