package com.seatide.DTO;

import lombok.Data;

import java.util.List;

@Data
public class MenuResponseDTO {
    private String merchantId;
    private List<CategoryDTO> categories;
    private List<DishDTO> dishes;
}
