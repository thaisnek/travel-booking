package com.example.travelweb.service.implement;

import com.example.travelweb.converter.ContactMapper;
import com.example.travelweb.dto.request.ContactRequest;
import com.example.travelweb.dto.request.ReplyRequest;
import com.example.travelweb.dto.response.ContactResponse;
import com.example.travelweb.entity.Admin;
import com.example.travelweb.entity.Contact;
import com.example.travelweb.entity.User;
import com.example.travelweb.repository.AdminRepository;
import com.example.travelweb.repository.ContactRepository;
import com.example.travelweb.repository.UserRepository;
import com.example.travelweb.service.ContactService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.mail.MailAuthenticationException;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ContactServiceImpl implements ContactService {

    private static final Logger log = LoggerFactory.getLogger(ContactServiceImpl.class);

    private final ContactRepository contactRepository;
    private final UserRepository userRepository;
    private final AdminRepository adminRepository;
    private final ContactMapper contactMapper;
    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String mailFrom;

    @Transactional
    public ContactResponse createContact(ContactRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Contact contact = contactMapper.toEntity(request);
        contact.setUser(user);
        contact.setIsReply(false);
        contact.setAdmin(null);

        Contact saved = contactRepository.save(contact);
        return contactMapper.toDto(saved);
    }

    @Transactional(readOnly = true)
    public Page<ContactResponse> getUnrepliedContacts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Contact> contactsPage = contactRepository.findByIsReplyFalse(pageable);
        return contactsPage.map(contactMapper::toDto);
    }

    @Transactional
    public boolean replyContact(ReplyRequest request) {
        Optional<Contact> optContact = contactRepository.findById(request.getChatID());
        if (optContact.isEmpty()) return false;
        Contact contact = optContact.get();

        Admin admin = adminRepository.findById(request.getAdminId())
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(contact.getEmail());
        if (mailFrom != null && !mailFrom.isBlank()) {
            message.setFrom(mailFrom);
        }
        message.setSubject("Phản hồi liên hệ");
        message.setText(request.getReplyMessage());
        try {
            mailSender.send(message);
        } catch (MailAuthenticationException ex) {
            log.warn("Mail authentication failed while replying contact: chatId={}", contact.getChatID(), ex);
            throw new IllegalStateException(
                    "Khong the gui email phan hoi: Gmail yeu cau App Password hoac thong tin SMTP khong dung.",
                    ex
            );
        } catch (MailException ex) {
            log.warn("Mail sending failed while replying contact: chatId={}", contact.getChatID(), ex);
            throw new IllegalStateException(
                    "Khong the gui email phan hoi. Vui long kiem tra cau hinh SMTP.",
                    ex
            );
        }

        contact.setIsReply(true);
        contact.setAdmin(admin);
        contactRepository.save(contact);

        log.info("Replied to contact: chatId={}", contact.getChatID());
        return true;
    }
}
