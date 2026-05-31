package com.example.travelweb.service;

import com.example.travelweb.dto.request.ContactRequest;
import com.example.travelweb.dto.request.ReplyRequest;
import com.example.travelweb.dto.response.ContactResponse;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;


public interface ContactService {
    ContactResponse createContact(ContactRequest request);

    boolean replyContact(ReplyRequest request);

    Page<ContactResponse> getUnrepliedContacts(int page, int size);
}
