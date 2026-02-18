package com.acem.cmos.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "subjects")
public class Subject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // e.g., "Operating Systems"

    @Column(nullable = false)
    private String code; // e.g., "CS101"

    @Column(nullable = false)
    private Integer semester; // 1 or 2

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @OneToMany(mappedBy = "subject", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<Material> materials = new java.util.ArrayList<>();
}
