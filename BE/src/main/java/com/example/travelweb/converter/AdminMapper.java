package com.example.travelweb.converter;

import com.example.travelweb.dto.request.AdminCreateRequest;
import com.example.travelweb.dto.response.AdminResponse;
import com.example.travelweb.entity.Admin;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AdminMapper {
    @Mapping(target = "adminID", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    Admin toEntity(AdminCreateRequest request);

    AdminResponse toResponse(Admin admin);
}
