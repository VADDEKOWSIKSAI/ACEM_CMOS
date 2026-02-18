package com.acem.cmos.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "departments")
public class Department {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // e.g., "CSE", "ECE"

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "year_id", nullable = false)
    private Year year;
}
