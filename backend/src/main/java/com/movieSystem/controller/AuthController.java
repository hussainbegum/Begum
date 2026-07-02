package com.movieSystem.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.movieSystem.entity.User;
import com.movieSystem.service.UserService;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    @Autowired
    private UserService service;

    /**
     * 📝 USER REGISTRATION
     * POST -> http://localhost:8081/auth/register
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            return ResponseEntity.ok(service.register(user));
        } catch(Exception e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    /**
     * 🔐 USER SECURE LOGIN
     * POST -> http://localhost:8081/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        try {
            // Extracts the email and password sent by Angular and verifies them
            return ResponseEntity.ok(
                    service.login(
                            user.getEmail(),
                            user.getPassword()));
        } catch(Exception e) {
            // Sends back a clean bad request message if email/password don't match
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }
}