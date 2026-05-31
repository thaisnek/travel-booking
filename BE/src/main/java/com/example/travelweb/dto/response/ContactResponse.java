package com.example.travelweb.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContactResponse {
    private Long chatID;
    private String fullName;
    private String phoneNumber;
    private String email;
    private String message;
    private Boolean isReply;
    private Long userId;
    private Long adminId;
}
