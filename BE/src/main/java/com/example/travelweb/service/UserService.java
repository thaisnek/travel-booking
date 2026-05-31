package com.example.travelweb.service;

import com.example.travelweb.dto.request.ChangePasswordRequest;
import com.example.travelweb.dto.request.UpdateUserRequest;
import com.example.travelweb.dto.response.UserResponse;
import com.example.travelweb.entity.User;
import com.example.travelweb.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private static final Set<String> ALLOWED_IMAGE_EXTENSIONS = Set.of("jpg", "jpeg", "png", "gif", "webp");

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${avatar.upload.dir}")
    private String uploadDir;

    public UserResponse updateUser(Long userId, UpdateUserRequest updateUserDto) {
        User user = findById(userId);
        user.setFullName(updateUserDto.getFullName());
        user.setAddress(updateUserDto.getAddress());
        user.setEmail(updateUserDto.getEmail());
        user.setPhoneNumber(updateUserDto.getPhoneNumber());
        user.setUpdatedDate(LocalDateTime.now());
        User saved = userRepository.save(user);
        return toUserResponse(saved);
    }

    public boolean changePassword(Long userId, ChangePasswordRequest changePasswordDto) {
        User user = findById(userId);
        if (passwordEncoder.matches(changePasswordDto.getOldPassword(), user.getPassword())) {
            if (passwordEncoder.matches(changePasswordDto.getNewPassword(), user.getPassword())) {
                return false;
            }
            user.setPassword(passwordEncoder.encode(changePasswordDto.getNewPassword()));
            user.setUpdatedDate(LocalDateTime.now());
            userRepository.save(user);
            return true;
        }
        return false;
    }

    public String updateAvatar(Long userId, MultipartFile avatarFile) {
        User user = findById(userId);

        // Sanitize filename — sử dụng UUID thay vì originalFilename để tránh path traversal
        String originalFilename = avatarFile.getOriginalFilename();
        String extension = getSafeImageExtension(originalFilename);
        String fileName = UUID.randomUUID() + "." + extension;
        Path filePath = Paths.get(uploadDir, fileName);

        try {
            // Xóa ảnh cũ nếu có
            if (user.getAvatar() != null) {
                Path oldFilePath = Paths.get(uploadDir, user.getAvatar());
                if (Files.exists(oldFilePath)) {
                    Files.delete(oldFilePath);
                }
            }

            // Lưu ảnh mới
            Files.createDirectories(filePath.getParent());
            Files.write(filePath, avatarFile.getBytes());
            user.setAvatar(fileName);
            user.setUpdatedDate(LocalDateTime.now());
            userRepository.save(user);
            return fileName;
        } catch (IOException e) {
            throw new RuntimeException("Không thể lưu ảnh đại diện: " + e.getMessage());
        }
    }

    public User findById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + userId));
    }

    public Page<UserResponse> getAllUsers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> usersPage = userRepository.findByActiveTrueOrActiveIsNull(pageable);
        return usersPage.map(this::toUserResponse);
    }

    public UserResponse getUserProfile(Long id) {
        User user = findById(id);
        return toUserResponse(user);
    }

    public void deleteUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User with id " + id + " does not exist."));
        user.setActive(false);
        user.setUpdatedDate(LocalDateTime.now());
        userRepository.save(user);
    }

    private UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .userId(user.getUserID())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .address(user.getAddress())
                .phone(user.getPhoneNumber())
                .email(user.getEmail())
                .avatarUrl(user.getAvatar() != null ? "/ltweb/images/avatar/" + user.getAvatar() : null)
                .active(!Boolean.FALSE.equals(user.getActive()))
                .build();
    }

    private String getSafeImageExtension(String originalFilename) {
        if (originalFilename == null || !originalFilename.contains(".")) {
            return "jpg";
        }

        String extension = originalFilename.substring(originalFilename.lastIndexOf(".") + 1).toLowerCase();
        if (!ALLOWED_IMAGE_EXTENSIONS.contains(extension)) {
            throw new IllegalArgumentException("Định dạng ảnh không được hỗ trợ");
        }
        return extension;
    }
}
