package com.example.jwt_auth_spring_boot.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class ForgotPasswordRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email address")
    private String email;
}
