package com.example.travelweb.controller;

import com.example.travelweb.dto.request.LoginRequest;
import com.example.travelweb.dto.request.RegisterRequest;
import com.example.travelweb.dto.response.JwtResponse;
import com.example.travelweb.service.AuthenticationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest request) {
        authenticationService.registerUser(request);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@Valid @RequestBody LoginRequest request) {
        JwtResponse response = authenticationService.login(request);
        return ResponseEntity.ok(response);
    }
}
