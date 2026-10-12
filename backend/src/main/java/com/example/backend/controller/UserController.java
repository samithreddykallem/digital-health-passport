package com.example.backend.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.model.User;
import com.example.backend.service.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        // Debugging: inspect received fields without exposing the password
        System.out.println("----- REGISTRATION DEBUG -----");
        System.out.println("Name: " + user.getName());
        System.out.println("Email: " + user.getEmail());
        System.out.println("Password received: "
                + (user.getPassword() != null
                && !user.getPassword().isBlank()));
        System.out.println("Phone: " + user.getPhone());
        System.out.println("------------------------------");

        // Validate required fields
        if (user.getName() == null || user.getName().isBlank()
                || user.getEmail() == null || user.getEmail().isBlank()
                || user.getPassword() == null || user.getPassword().isBlank()
                || user.getPhone() == null || user.getPhone().isBlank()) {

            return ResponseEntity.badRequest().body(
                    Map.of("message", "All fields are required")
            );
        }

        try {
            User registeredUser = userService.registerUser(user);

            return ResponseEntity.status(HttpStatus.CREATED).body(
                    Map.of(
                            "message", "Registration successful",
                            "id", registeredUser.getId(),
                            "name", registeredUser.getName(),
                            "email", registeredUser.getEmail()
                    )
            );

        } catch (RuntimeException e) {

            if ("Email already registered".equals(e.getMessage())) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(
                        Map.of("message", "Email already registered")
                );
            }

            throw e;
        }
    }
}