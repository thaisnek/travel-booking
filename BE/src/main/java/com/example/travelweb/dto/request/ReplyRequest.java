package com.example.travelweb.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReplyRequest {
    @NotNull(message = "Contact id is required")
    private Long chatID;

    @NotBlank(message = "Reply message is required")
    @Size(max = 4000, message = "Reply message must not exceed 4000 characters")
    private String replyMessage;

    private Long adminId;
}
