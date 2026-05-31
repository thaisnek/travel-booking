package com.example.travelweb.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "tbl_invoice")
@Getter
@Setter
public class Invoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long invoiceID;

    @OneToOne
    @JoinColumn(name = "bookingID", nullable = false)
    private Booking booking;

    private long amount;
    private LocalDateTime dateIssued;
    private String details;
}
