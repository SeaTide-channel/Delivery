package com.seatide.entity;

import lombok.Data;

import jakarta.persistence.*;

@Data
@Entity
@Table(name = "dish")
public class Dish {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long categoryId;

    private String name;

    private Integer sortOrder;

    private Double price;

    private String imageUrl;

    private String status;

    private String description;

    private Long merchantId;
}
