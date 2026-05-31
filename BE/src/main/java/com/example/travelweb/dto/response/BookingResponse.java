package com.example.travelweb.dto.response;

import com.example.travelweb.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {
    private Long bookingID;
    private Long userId;
    private Long tourId;
    private String bookingDate;
    private String expiresAt;
    private Integer numAdults;
    private Integer numChildren;
    private Long totalPrice;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String address;
    private String bookingStatus;
    private String paymentMethod;

}
