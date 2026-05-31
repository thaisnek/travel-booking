package com.example.travelweb.controller.Admin;

import com.example.travelweb.dto.request.ReplyRequest;
import com.example.travelweb.dto.response.ContactResponse;
import com.example.travelweb.security.SecurityUtils;
import com.example.travelweb.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/contacts")
@RequiredArgsConstructor
public class AdminContactController {

    private final ContactService contactService;

    @GetMapping("/all-contacts")
    public ResponseEntity<Page<ContactResponse>> getUnrepliedContacts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size) {
        Page<ContactResponse> contacts = contactService.getUnrepliedContacts(page, size);
        return ResponseEntity.ok(contacts);
    }

    @PostMapping("/reply")
    public ResponseEntity<?> replyContact(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody ReplyRequest request) {
        Long adminId = SecurityUtils.getTokenUserId(jwt);
        request.setAdminId(adminId);
        boolean result = contactService.replyContact(request);
        if (result) {
            return ResponseEntity.ok("Phản hồi qua email thành công.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy liên hệ.");
        }
    }
}
