package com.seatide.entity;

import lombok.Data;

import jakarta.persistence.*;

@Data
@Entity
@Table(name = "category")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private Integer sortOrder;

    private Long merchantId;
}
