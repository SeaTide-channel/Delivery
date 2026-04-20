package com.seatide.repository;

import com.seatide.entity.Dish;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DishRepository extends JpaRepository<Dish, Long> {
    List<Dish> findByMerchantId(Long merchantId);
}
