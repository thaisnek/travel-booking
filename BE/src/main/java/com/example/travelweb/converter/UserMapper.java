package com.example.travelweb.converter;

import com.example.travelweb.dto.request.UpdateUserRequest;
import com.example.travelweb.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface UserMapper {
    void updateUserFromDto(UpdateUserRequest dto, @MappingTarget User user);
}
