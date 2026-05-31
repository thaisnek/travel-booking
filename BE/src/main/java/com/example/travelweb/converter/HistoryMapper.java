package com.example.travelweb.converter;

import com.example.travelweb.dto.response.HistoryResponseDTO;
import com.example.travelweb.entity.History;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface HistoryMapper {
    @Mapping(source = "historyID", target = "historyID")
    @Mapping(source = "actionType", target = "actionType")
    @Mapping(source = "timestamp", target = "timestamp")
    @Mapping(source = "tour.title", target = "tourTitle")
    @Mapping(source = "tour", target = "tourResponse")
    @Mapping(source = "booking", target = "bookingResponse")
    HistoryResponseDTO toDto(History history);
}
