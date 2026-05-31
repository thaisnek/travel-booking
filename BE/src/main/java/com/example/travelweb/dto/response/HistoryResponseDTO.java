package com.example.travelweb.dto.response;

import com.example.travelweb.enums.ActionType;
import com.example.travelweb.enums.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class HistoryResponseDTO {
    private Long historyID;
    private ActionType actionType;
    private LocalDateTime timestamp;
    private String tourTitle;
    private TourResponse tourResponse;
    private BookingResponse bookingResponse;
}
