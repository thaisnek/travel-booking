package com.example.travelweb.controller;

import com.example.travelweb.dto.request.ContactRequest;
import com.example.travelweb.dto.response.ContactResponse;
import com.example.travelweb.security.SecurityUtils;
import com.example.travelweb.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contacts")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    @PostMapping("/create")
    public ResponseEntity<ContactResponse> createContact(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody ContactRequest request) {
        SecurityUtils.requireTokenUserId(request.getUserId(), jwt);
        ContactResponse response = contactService.createContact(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
