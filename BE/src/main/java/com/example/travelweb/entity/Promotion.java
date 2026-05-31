package com.example.travelweb.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "tbl_promotion")
@Data
public class Promotion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long promotionID;

    @Column(unique = true, nullable = false)
    private String code;
    private String description;
    private double discount;
    private LocalDate startDate;
    private LocalDate endDate;
    private int quantity;
}
