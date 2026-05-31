package com.example.travelweb.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "tbl_checkout")
@Getter
@Setter
public class Checkout {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long checkoutID;

    @OneToOne
    @JoinColumn(name = "bookingID", nullable = false, unique = true)
    private Booking booking;

    private String paymentMethod;
    private LocalDateTime paymentDate;
    private double amount;

    private String paymentStatus;

    @Column(unique = true)
    private String transactionID;
}
