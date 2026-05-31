package com.example.travelweb.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "tbl_image")
@Getter
@Setter
public class Image {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long imageID;

    @ManyToOne
    @JoinColumn(name = "tourID", nullable = false)
    private Tour tour;

    private String imageURL;
    private String description;
}
