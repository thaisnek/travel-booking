package com.example.travelweb.repository;

import com.example.travelweb.entity.Contact;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactRepository extends JpaRepository<Contact, Long> {
    Page<Contact> findByIsReplyFalse(Pageable pageable);
}
