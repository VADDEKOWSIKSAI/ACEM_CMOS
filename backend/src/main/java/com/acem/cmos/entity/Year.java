package com.acem.cmos.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "academic_years")
public class Year {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name; // e.g., "1st Year", "2nd Year"
}
