package com.example.jwt_auth_spring_boot.model;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class MfaVerificationRequest {
    private String username;
    private String mfaToken;
    // Getters and Setters
}
