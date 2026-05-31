package com.example.travelweb.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopCustomerResponse {
    private Long id;
    private String fullName;
    private Long totalPurchases;
    private Long totalAmount;
}
