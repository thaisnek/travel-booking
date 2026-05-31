package com.example.travelweb.controller.Admin;

import com.example.travelweb.dto.request.AdminCreateRequest;
import com.example.travelweb.dto.response.AdminResponse;
import com.example.travelweb.security.SecurityUtils;
import com.example.travelweb.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @PostMapping("/create")
    public AdminResponse createAdmin(@Valid @RequestBody AdminCreateRequest request) {
        return adminService.createAdmin(request);
    }

    @GetMapping("/{adminId}")
    public ResponseEntity<AdminResponse> getAdminById(
            @PathVariable Long adminId,
            @AuthenticationPrincipal Jwt jwt) {
        SecurityUtils.requireTokenUserId(adminId, jwt);
        AdminResponse adminResponse = adminService.getAdminById(adminId);
        return ResponseEntity.ok(adminResponse);
    }
}
