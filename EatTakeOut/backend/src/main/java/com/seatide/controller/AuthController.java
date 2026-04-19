package com.seatide.controller;

import com.seatide.entity.User;
import com.seatide.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // 登录处理
    @PostMapping("/api/login")
    public ResponseEntity<Map<String, Object>> login(@RequestParam("username") String username,
            @RequestParam("password") String password) {
        Map<String, Object> response = new HashMap<>();
        User user = userRepository.findByUsername(username);
        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            // 登录成功
            response.put("success", true);
            response.put("message", "登录成功");
            return ResponseEntity.ok(response);
        } else {
            // 登录失败
            response.put("success", false);
            response.put("error", "用户名或密码错误");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    // 注册处理
    @PostMapping("/api/register")
    public ResponseEntity<Map<String, Object>> register(@RequestParam("username") String username,
            @RequestParam("password") String password,
            @RequestParam("confirmPassword") String confirmPassword) {
        Map<String, Object> response = new HashMap<>();

        // 简单的注册验证
        if (!password.equals(confirmPassword)) {
            response.put("success", false);
            response.put("error", "两次输入的密码不一致");
            return ResponseEntity.badRequest().body(response);
        }

        // 检查用户名是否已存在
        if (userRepository.findByUsername(username) != null) {
            response.put("success", false);
            response.put("error", "用户名已存在");
            return ResponseEntity.badRequest().body(response);
        }

        // 创建新用户并保存到数据库
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);

        response.put("success", true);
        response.put("message", "注册成功，请登录");
        return ResponseEntity.ok(response);
    }

    // 首页
    @GetMapping("/api/home")
    public ResponseEntity<Map<String, Object>> showHomePage() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "欢迎访问首页");
        return ResponseEntity.ok(response);
    }
}