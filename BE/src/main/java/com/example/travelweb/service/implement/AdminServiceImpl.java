package com.example.travelweb.service.implement;

import com.example.travelweb.converter.AdminMapper;
import com.example.travelweb.dto.request.AdminCreateRequest;
import com.example.travelweb.dto.response.AdminResponse;
import com.example.travelweb.entity.Admin;
import com.example.travelweb.repository.AdminRepository;
import com.example.travelweb.repository.UserRepository;
import com.example.travelweb.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final AdminRepository adminRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AdminMapper adminMapper;

    public AdminResponse createAdmin(AdminCreateRequest request) {
        if (adminRepository.findByUsername(request.getUsername()).isPresent()
                || userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username already exists");
        }
        Admin admin = adminMapper.toEntity(request);
        admin.setCreatedDate(LocalDate.now());
        admin.setPassword(passwordEncoder.encode(request.getPassword()));
        Admin saved = adminRepository.save(admin);
        return adminMapper.toResponse(saved);
    }

    public AdminResponse getAdminById(Long adminId) {
        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found with id: " + adminId));
        return adminMapper.toResponse(admin);
    }
}
