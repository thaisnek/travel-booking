package com.example.travelweb.converter;

import com.example.travelweb.dto.request.ContactRequest;
import com.example.travelweb.dto.response.ContactResponse;
import com.example.travelweb.entity.Contact;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ContactMapper {
    @Mapping(source = "user.userID", target = "userId")
    @Mapping(source = "admin.adminID", target = "adminId")
    ContactResponse toDto(Contact contact);

    @Mapping(target = "chatID", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "admin", ignore = true)
    @Mapping(target = "isReply", ignore = true)
    Contact toEntity(ContactRequest request);
}
