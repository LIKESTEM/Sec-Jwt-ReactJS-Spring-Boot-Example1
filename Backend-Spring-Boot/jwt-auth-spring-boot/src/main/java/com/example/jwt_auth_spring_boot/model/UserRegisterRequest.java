package com.example.jwt_auth_spring_boot.model;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class UserRegisterRequest {
    private String username;
    private String password;
    private String email;
    private String contactNumber;
    private String role; // Role name (e.g., Admin, Customer, etc.)
    // Getters and Setters
}
