package com.example.travelweb.service;

import com.example.travelweb.configuration.JwtUtil;
import com.example.travelweb.dto.request.LoginRequest;
import com.example.travelweb.dto.request.RegisterRequest;
import com.example.travelweb.dto.response.JwtResponse;
import com.example.travelweb.entity.Admin;
import com.example.travelweb.entity.User;
import com.example.travelweb.repository.AdminRepository;
import com.example.travelweb.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public void registerUser(RegisterRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()
                || adminRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username already exists");
        }
        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .createdDate(LocalDateTime.now())
                .build();
        userRepository.save(user);
    }

    public JwtResponse login(LoginRequest request) {
        var adminOpt = adminRepository.findByUsername(request.getUsername());
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            if (!passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
                throw new BadCredentialsException("Invalid password");
            }
            String token = jwtUtil.generateToken(admin.getUsername(), "ADMIN", admin.getAdminID());
            return new JwtResponse(token, "ADMIN");
        }

        var userOpt = userRepository.findByUsername(request.getUsername());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (Boolean.FALSE.equals(user.getActive())) {
                throw new BadCredentialsException("User account is disabled");
            }
            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                throw new BadCredentialsException("Invalid password");
            }
            String token = jwtUtil.generateToken(user.getUsername(), "USER", user.getUserID());
            return new JwtResponse(token, "USER");
        }

        throw new BadCredentialsException("User or Admin not found");
    }
}
