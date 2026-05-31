package com.example.travelweb.service.implement;

import com.example.travelweb.converter.HistoryMapper;
import com.example.travelweb.dto.response.HistoryResponseDTO;
import com.example.travelweb.entity.History;
import com.example.travelweb.enums.ActionType;
import com.example.travelweb.repository.HistoryRepository;
import com.example.travelweb.service.HistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class HistoryServiceImpl implements HistoryService {

    private final HistoryRepository historyRepository;
    private final HistoryMapper historyMapper;

    @Override
    @Transactional(readOnly = true)
    public Page<HistoryResponseDTO> getUserHistory(Long userId, ActionType actionType, Pageable pageable) {
        Page<History> histories;
        if (actionType != null) {
            histories = historyRepository.findByUserUserIDAndActionType(userId, actionType, pageable);
        } else {
            histories = historyRepository.findByUserUserID(userId, pageable);
        }
        return histories.map(historyMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<HistoryResponseDTO> getAllHistory(Pageable pageable) {
        return historyRepository.findAll(pageable).map(historyMapper::toDto);
    }
}
