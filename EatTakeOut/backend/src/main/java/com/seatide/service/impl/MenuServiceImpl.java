package com.seatide.service.impl;

import com.seatide.DTO.CategoryDTO;
import com.seatide.DTO.DishDTO;
import com.seatide.DTO.MenuResponseDTO;
import com.seatide.entity.Category;
import com.seatide.entity.Dish;
import com.seatide.repository.CategoryRepository;
import com.seatide.repository.DishRepository;
import com.seatide.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MenuServiceImpl implements MenuService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private DishRepository dishRepository;

    @Override
    public MenuResponseDTO getMenu(String merchantId) {
        MenuResponseDTO response = new MenuResponseDTO();
        response.setMerchantId(merchantId);

        // 转换 merchantId 为 Long
        Long merchantIdLong = Long.parseLong(merchantId);

        // 获取分类并排序
        List<Category> categories = categoryRepository.findByMerchantId(merchantIdLong);
        List<CategoryDTO> categoryDTOs = categories.stream()
                .sorted((c1, c2) -> {
                    if (c1.getSortOrder() != null && c2.getSortOrder() != null) {
                        int sortOrderCompare = c1.getSortOrder().compareTo(c2.getSortOrder());
                        if (sortOrderCompare != 0) {
                            return sortOrderCompare;
                        }
                    }
                    // 按 id 字典序稳定排序
                    return c1.getId().toString().compareTo(c2.getId().toString());
                })
                .map(this::convertToCategoryDTO)
                .collect(Collectors.toList());
        response.setCategories(categoryDTOs);

        // 获取菜品并排序
        List<Dish> dishes = dishRepository.findByMerchantId(merchantIdLong);
        List<DishDTO> dishDTOs = dishes.stream()
                .sorted((d1, d2) -> {
                    // 先按 categoryId 分组
                    if (!d1.getCategoryId().equals(d2.getCategoryId())) {
                        return d1.getCategoryId().compareTo(d2.getCategoryId());
                    }
                    // 同一分类内按 sortOrder 排序
                    if (d1.getSortOrder() != null && d2.getSortOrder() != null) {
                        int sortOrderCompare = d1.getSortOrder().compareTo(d2.getSortOrder());
                        if (sortOrderCompare != 0) {
                            return sortOrderCompare;
                        }
                    }
                    // 按 id 字典序稳定排序
                    return d1.getId().toString().compareTo(d2.getId().toString());
                })
                .map(this::convertToDishDTO)
                .collect(Collectors.toList());
        response.setDishes(dishDTOs);

        return response;
    }

    private CategoryDTO convertToCategoryDTO(Category category) {
        CategoryDTO dto = new CategoryDTO();
        dto.setId(category.getId().toString());
        dto.setName(category.getName());
        dto.setSortOrder(category.getSortOrder());
        return dto;
    }

    private DishDTO convertToDishDTO(Dish dish) {
        DishDTO dto = new DishDTO();
        dto.setId(dish.getId().toString());
        dto.setCategoryId(dish.getCategoryId().toString());
        dto.setName(dish.getName());
        dto.setSortOrder(dish.getSortOrder());
        dto.setPrice(dish.getPrice());
        dto.setImageUrl(dish.getImageUrl() != null ? dish.getImageUrl() : "");
        dto.setStatus(dish.getStatus() != null ? dish.getStatus() : "ON_SALE");
        dto.setDescription(dish.getDescription());
        return dto;
    }
}
