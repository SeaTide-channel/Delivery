package com.seatide.DTO;

import lombok.Data;

@Data
public class DishDTO {
    private String id;
    private String categoryId;
    private String name;
    private Integer sortOrder;
    private Double price;
    private String imageUrl;
    private String status;
    private String description;
}
