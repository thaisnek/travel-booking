package com.example.travelweb.service;

import com.example.travelweb.dto.response.HistoryResponseDTO;
import com.example.travelweb.enums.ActionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface HistoryService {
    Page<HistoryResponseDTO> getUserHistory(Long userId, ActionType actionType, Pageable pageable);
    Page<HistoryResponseDTO> getAllHistory(Pageable pageable);
}
