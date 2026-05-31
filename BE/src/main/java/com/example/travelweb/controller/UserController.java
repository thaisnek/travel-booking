package com.example.travelweb.controller;

import com.example.travelweb.dto.api.ApiResponse;
import com.example.travelweb.dto.request.ChangePasswordRequest;
import com.example.travelweb.dto.request.UpdateUserRequest;
import com.example.travelweb.dto.response.AvatarResponse;
import com.example.travelweb.dto.response.UserResponse;
import com.example.travelweb.security.SecurityUtils;
import com.example.travelweb.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PutMapping("/update/{userId}")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(
            @PathVariable Long userId,
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody UpdateUserRequest updateUserRequest) {
        SecurityUtils.requireTokenUserId(userId, jwt);
        UserResponse updatedUser = userService.updateUser(userId, updateUserRequest);
        return ResponseEntity.ok(
                ApiResponse.<UserResponse>builder()
                        .code(200)
                        .message("Cập nhật thông tin thành công!")
                        .result(updatedUser)
                        .build()
        );
    }

    @PutMapping("/change-password/{userId}")
    public ResponseEntity<ApiResponse<Object>> changePassword(
            @PathVariable Long userId,
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody ChangePasswordRequest changePasswordRequest) {
        SecurityUtils.requireTokenUserId(userId, jwt);
        boolean result = userService.changePassword(userId, changePasswordRequest);
        if (!result) {
            return ResponseEntity.badRequest().body(
                    ApiResponse.builder()
                            .code(400)
                            .message("Mật khẩu cũ không chính xác hoặc mật khẩu mới trùng với mật khẩu cũ!")
                            .build()
            );
        }
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .code(200)
                        .message("Đổi mật khẩu thành công!")
                        .build()
        );
    }

    @PutMapping("/change-avatar/{userId}")
    public ResponseEntity<ApiResponse<AvatarResponse>> changeAvatar(
            @PathVariable Long userId,
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam("avatar") MultipartFile avatarFile) {
        SecurityUtils.requireTokenUserId(userId, jwt);
        if (avatarFile.isEmpty()) {
            return ResponseEntity.badRequest().body(
                    ApiResponse.<AvatarResponse>builder()
                            .code(400)
                            .message("Vui lòng chọn một file ảnh!")
                            .build()
            );
        }
        String contentType = avatarFile.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.badRequest().body(
                    ApiResponse.<AvatarResponse>builder()
                            .code(400)
                            .message("File phải là ảnh (jpeg, png, jpg, gif)!")
                            .build()
            );
        }
        if (avatarFile.getSize() > 5 * 1024 * 1024) {
            return ResponseEntity.badRequest().body(
                    ApiResponse.<AvatarResponse>builder()
                            .code(400)
                            .message("Kích thước ảnh không được vượt quá 5MB!")
                            .build()
            );
        }

        String fileName = userService.updateAvatar(userId, avatarFile);
        AvatarResponse responseDto = new AvatarResponse();
        responseDto.setAvatarUrl("/ltweb/images/avatar/" + fileName);
        return ResponseEntity.ok(
                ApiResponse.<AvatarResponse>builder()
                        .code(200)
                        .message("Cập nhật ảnh thành công!")
                        .result(responseDto)
                        .build()
        );
    }

    @GetMapping("/{id}/profile")
    public ResponseEntity<UserResponse> getUserProfile(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt) {
        SecurityUtils.requireTokenUserId(id, jwt);
        return ResponseEntity.ok(userService.getUserProfile(id));
    }
}
