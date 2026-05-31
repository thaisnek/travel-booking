package com.example.travelweb.service.implement;

import com.example.travelweb.converter.ContactMapper;
import com.example.travelweb.dto.request.ReplyRequest;
import com.example.travelweb.entity.Admin;
import com.example.travelweb.entity.Contact;
import com.example.travelweb.repository.AdminRepository;
import com.example.travelweb.repository.ContactRepository;
import com.example.travelweb.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mail.MailAuthenticationException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class ContactServiceImplTests {

    private ContactRepository contactRepository;
    private AdminRepository adminRepository;
    private JavaMailSender mailSender;
    private ContactServiceImpl contactService;

    @BeforeEach
    void setUp() {
        contactRepository = mock(ContactRepository.class);
        UserRepository userRepository = mock(UserRepository.class);
        adminRepository = mock(AdminRepository.class);
        ContactMapper contactMapper = mock(ContactMapper.class);
        mailSender = mock(JavaMailSender.class);
        contactService = new ContactServiceImpl(
                contactRepository,
                userRepository,
                adminRepository,
                contactMapper,
                mailSender
        );
    }

    @Test
    void replyContactDoesNotMarkContactAsRepliedWhenMailAuthenticationFails() {
        Contact contact = new Contact();
        contact.setChatID(1L);
        contact.setEmail("customer@example.com");
        contact.setIsReply(false);

        Admin admin = new Admin();
        admin.setAdminID(1L);

        ReplyRequest request = ReplyRequest.builder()
                .chatID(contact.getChatID())
                .adminId(admin.getAdminID())
                .replyMessage("Reply message")
                .build();

        when(contactRepository.findById(contact.getChatID())).thenReturn(Optional.of(contact));
        when(adminRepository.findById(admin.getAdminID())).thenReturn(Optional.of(admin));
        doThrow(new MailAuthenticationException("Authentication failed"))
                .when(mailSender)
                .send(any(SimpleMailMessage.class));

        assertThatThrownBy(() -> contactService.replyContact(request))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("App Password");

        assertThat(contact.getIsReply()).isFalse();
        verify(contactRepository, never()).save(any(Contact.class));
    }
}
