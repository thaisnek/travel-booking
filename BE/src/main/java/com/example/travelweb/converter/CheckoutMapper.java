package com.example.travelweb.converter;

import com.example.travelweb.dto.request.CheckoutRequest;
import com.example.travelweb.dto.response.CheckoutResponse;
import com.example.travelweb.entity.Checkout;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CheckoutMapper {
    @Mapping(source = "bookingId", target = "booking.bookingID")
    Checkout toEntity(CheckoutRequest request);

    @Mapping(source = "booking.bookingID", target = "bookingId")
    CheckoutResponse toResponseDto(Checkout checkout);
}
