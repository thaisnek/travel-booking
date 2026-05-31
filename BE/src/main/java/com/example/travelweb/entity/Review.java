package com.example.travelweb.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "tbl_review",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_review_user_tour",
                columnNames = {"userID", "tourID"}
        )
)
@Getter
@Setter
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reviewID;

    @ManyToOne
    @JoinColumn(name = "userID", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "tourID", nullable = false)
    private Tour tour;

    private int rating;
    private String comment;
    private LocalDateTime timestamp;
}
