package com.example.travelweb.entity;

import com.example.travelweb.enums.ActionType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "tbl_history")
@Getter
@Setter
public class History {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long historyID;

    @ManyToOne
    @JoinColumn(name = "userID", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "tourID", nullable = false)
    private Tour tour;

    @ManyToOne
    @JoinColumn(name = "bookingID")
    private Booking booking;

    @Enumerated(EnumType.STRING)
    private ActionType actionType;

    private LocalDateTime timestamp;
}
