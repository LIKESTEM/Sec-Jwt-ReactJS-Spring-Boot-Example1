package com.example.jwt_auth_spring_boot.controller;

import com.example.jwt_auth_spring_boot.config.JwtUtil;
import com.example.jwt_auth_spring_boot.model.*;
import com.example.jwt_auth_spring_boot.service.AuthenticationService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthenticationController {

    @Autowired
    private AuthenticationService authService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserRegisterRequest request) {
        try {
            authService.registerUser(request.getUsername(), request.getPassword(), request.getEmail(),
                    request.getContactNumber(), request.getRole());
            return ResponseEntity.ok("User registered successfully!");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response
    ) {
        String result = authService
                .authenticateUser(request.getUsername(), request.getPassword());
        if ("MFA_REQUIRED".equals(result)) {
            return ResponseEntity
                    .status(HttpStatus.ACCEPTED)
                    .body("MFA required. Please check your email.");
        }

        Cookie cookie = new Cookie("jwt", result);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(10 * 60 * 60); // 10 hours
        response.addCookie(cookie);

        return ResponseEntity.ok("Login successful!");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        authService.sendResetToken(request.getEmail());
        return ResponseEntity.ok("Password reset link sent to your email.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request.getToken(), request.getNewPassword());
        return ResponseEntity.ok("Password has been reset successfully.");
    }

    @PostMapping("/verify-mfa")
    public ResponseEntity<?> verifyMfa(@RequestBody MfaVerificationRequest request, HttpServletResponse response) {
        boolean isVerified = authService.verifyMfa(request.getUsername(), request.getMfaToken());
        if (!isVerified) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid MFA token");
        }

        // Generate and store JWT in an HTTP-only cookie
        String jwt = jwtUtil.generateToken(request.getUsername());
        Cookie cookie = new Cookie("jwt", jwt);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(10 * 60 * 60); // 10 hours
        response.addCookie(cookie);

        return ResponseEntity.ok("MFA verification successful! JWT issued.");
    }

}
