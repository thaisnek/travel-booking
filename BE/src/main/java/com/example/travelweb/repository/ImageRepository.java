package com.example.travelweb.repository;

import com.example.travelweb.entity.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImageRepository extends JpaRepository<Image, Long> {
    // Lấy danh sách images theo tourID
    List<Image> findByTourTourID(Long tourID);

    // Xóa tất cả images theo tourID (nếu cần)
    void deleteByTourTourID(Long tourID);
}
