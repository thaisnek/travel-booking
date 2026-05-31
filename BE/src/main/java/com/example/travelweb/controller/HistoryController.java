package com.example.travelweb.controller;

import com.example.travelweb.dto.response.HistoryResponseDTO;
import com.example.travelweb.enums.ActionType;
import com.example.travelweb.security.SecurityUtils;
import com.example.travelweb.service.HistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/history")
@RequiredArgsConstructor
public class HistoryController {

    private final HistoryService historyService;

    @GetMapping("/user/{userId}")
    public Page<HistoryResponseDTO> getUserHistory(
            @PathVariable Long userId,
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam(required = false) ActionType actionType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size) {
        SecurityUtils.requireTokenUserId(userId, jwt);
        Pageable pageable = PageRequest.of(page, size);
        return historyService.getUserHistory(userId, actionType, pageable);
    }
}
