package com.example.travelweb.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingTourStatusResponse {
    private boolean hasPending;
    private Long pendingBookingId;
    private boolean hasConfirmed;
    private Long confirmedBookingId;
}
