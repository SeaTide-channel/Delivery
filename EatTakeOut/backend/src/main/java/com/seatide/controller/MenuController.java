package com.seatide.controller;

import com.seatide.DTO.MenuResponseDTO;
import com.seatide.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/merchantadmin/merchants")
public class MenuController {

    @Autowired
    private MenuService menuService;

    @GetMapping("/{merchantId}/menu")
    public ResponseEntity<MenuResponseDTO> getMenu(@PathVariable String merchantId) {
        MenuResponseDTO response = menuService.getMenu(merchantId);
        return ResponseEntity.ok(response);
    }
}
