package com.example.travelweb.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "tbl_timeline")
@Getter
@Setter
public class Timeline {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long timeLineID;

    @Column(name = "timeline_day")
    private long day;
    private String description;

    @ManyToOne
    @JoinColumn(name = "tourID", nullable = false)
    private Tour tour;
}
