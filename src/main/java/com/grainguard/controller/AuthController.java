package com.grainguard.controller;

import com.grainguard.dto.ApiResponse;
import com.grainguard.dto.AuthResponse;
import com.grainguard.dto.LoginRequest;
import com.grainguard.dto.RegisterRequest;
import com.grainguard.dto.UserDTO;
import com.grainguard.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Endpoints for user login, registration, and session info")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "User Login", description = "Authenticate user and return JWT bearer token")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Login successful"));
    }

    @PostMapping("/register")
    @Operation(summary = "Register User", description = "Register a new user (ADMIN, OFFICER, FPS_OWNER, TRANSPORTER, AUDITOR)")
    public ResponseEntity<ApiResponse<UserDTO>> register(@Valid @RequestBody RegisterRequest request) {
        UserDTO user = authService.register(request);
        return ResponseEntity.ok(ApiResponse.success(user, "User registered successfully"));
    }

    @GetMapping("/me")
    @Operation(summary = "Current User Profile", description = "Fetch profile details of the currently authenticated user")
    public ResponseEntity<ApiResponse<UserDTO>> getCurrentUser(Authentication authentication) {
        UserDTO user = authService.getCurrentUser(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(user, "Profile retrieved successfully"));
    }
}
