package com.example.travelweb.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CheckoutResponse {
    private long checkoutID;
    private Long bookingId;
    private String paymentMethod;
    private Long amount;
    private String paymentDate;
    private String paymentStatus;
    private String transactionID;

    public CheckoutResponse(long checkoutID, Long bookingId, String paymentMethod, double amount, String paymentStatus, String transactionID) {
        this.checkoutID = checkoutID;
        this.bookingId = bookingId;
        this.paymentMethod = paymentMethod;
        this.amount = (long) amount;
        this.paymentStatus = paymentStatus;
        this.transactionID = transactionID;
    }
}
