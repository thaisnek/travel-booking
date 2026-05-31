package com.example.travelweb.repository;

import com.example.travelweb.entity.Timeline;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TimelineRepository extends JpaRepository<Timeline, Long> {
    // Lấy danh sách timelines theo tourID
    List<Timeline> findByTourTourID(Long tourID);

    // Xóa tất cả timelines theo tourID (nếu cần)
    void deleteByTourTourID(Long tourID);
}
