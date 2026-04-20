package com.seatide.service;

import com.seatide.DTO.MenuResponseDTO;

public interface MenuService {
    MenuResponseDTO getMenu(String merchantId);
}
