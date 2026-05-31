package com.example.travelweb.converter;

import com.example.travelweb.dto.request.BookingRequest;
import com.example.travelweb.dto.response.BookingResponse;
import com.example.travelweb.entity.Booking;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BookingMapper {

    @Mapping(source = "tourId", target = "tour.tourID")
    @Mapping(source = "userId", target = "user.userID")
    @Mapping(target = "totalPrice", ignore = true)
    @Mapping(target = "bookingID", ignore = true)
    @Mapping(target = "bookingDate", ignore = true)
    @Mapping(target = "bookingStatus", ignore = true)
    @Mapping(target = "promotionCode", ignore = true)
    @Mapping(target = "paymentToken", ignore = true)
    @Mapping(target = "paypalPaymentId", ignore = true)
    @Mapping(target = "invoice", ignore = true)
    @Mapping(target = "checkout", ignore = true)
    Booking toEntity(BookingRequest request);

    @Mapping(source = "user.userID", target = "userId")
    @Mapping(source = "tour.tourID", target = "tourId")
    BookingResponse toResponseDto(Booking booking);
}
