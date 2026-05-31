package com.example.travelweb.service;

import com.example.travelweb.dto.response.CheckoutResponse;
import com.paypal.base.rest.PayPalRESTException;

public interface CheckoutService {
    String initiatePayment(Long bookingId) throws PayPalRESTException;
    CheckoutResponse completePayment(String paymentId, String payerId, Long bookingId, String paymentToken) throws PayPalRESTException;
    void cancelPayment(Long bookingId, String paymentToken);
}
