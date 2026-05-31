package com.example.travelweb.repository;

import com.example.travelweb.entity.Admin;
import com.example.travelweb.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminRepository extends JpaRepository<Admin, Long> {
    Optional<Admin> findByUsername(String username);
}
