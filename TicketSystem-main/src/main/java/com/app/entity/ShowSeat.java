package com.app.entity;

import com.app.enums.SeatType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "SHOW_SEATS")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShowSeat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String seatNo;

    @Enumerated(EnumType.STRING)
    private SeatType seatType;

    private Double price;

    // Use wrapper Boolean so Lombok generates getIsBooked() and getIsAvailable()
    private Boolean isAvailable;
    private Boolean isBooked;
    private Boolean isFoodContains;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "show_id")
    private Show show;
}