package com.example.travelweb.repository;

import com.example.travelweb.entity.History;
import com.example.travelweb.enums.ActionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HistoryRepository extends JpaRepository<History, Long> {
    Page<History> findByUserUserID(Long userId, Pageable pageable);
    Page<History> findByUserUserIDAndActionType(Long userId, ActionType actionType, Pageable pageable);
}
