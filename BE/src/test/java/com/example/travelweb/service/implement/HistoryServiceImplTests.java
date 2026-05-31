package com.example.travelweb.service.implement;

import com.example.travelweb.dto.response.HistoryResponseDTO;
import com.example.travelweb.entity.Booking;
import com.example.travelweb.entity.History;
import com.example.travelweb.entity.Image;
import com.example.travelweb.entity.Tour;
import com.example.travelweb.entity.User;
import com.example.travelweb.enums.ActionType;
import com.example.travelweb.enums.BookingStatus;
import com.example.travelweb.repository.BookingRepository;
import com.example.travelweb.repository.HistoryRepository;
import com.example.travelweb.repository.ImageRepository;
import com.example.travelweb.repository.TourRepository;
import com.example.travelweb.repository.UserRepository;
import com.example.travelweb.service.HistoryService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
class HistoryServiceImplTests {

    @Autowired
    private HistoryService historyService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TourRepository tourRepository;

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private HistoryRepository historyRepository;

    @Test
    void getUserHistoryReturnsBookedTourWithImages() {
        User user = User.builder()
                .username("history-user")
                .password("password")
                .email("history-user@example.com")
                .build();
        user = userRepository.save(user);

        Tour tour = new Tour();
        tour.setTitle("History tour");
        tour.setDescription("History tour description");
        tour.setDuration("2N1D");
        tour.setQuantity(10);
        tour.setPriceAdult(1_000_000L);
        tour.setPriceChild(500_000L);
        tour.setDestination("Da Nang");
        tour.setDomain("Mien Trung");
        tour.setAvailability(true);
        tour.setStartDate(LocalDate.now().plusDays(1));
        tour.setEndDate(LocalDate.now().plusDays(2));
        tour = tourRepository.save(tour);

        Image image = new Image();
        image.setTour(tour);
        image.setImageURL("history-tour.jpg");
        image.setDescription("History image");
        imageRepository.save(image);

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setTour(tour);
        booking.setBookingDate(LocalDateTime.now());
        booking.setNumAdults(1);
        booking.setNumChildren(0);
        booking.setTotalPrice(1_000_000L);
        booking.setFullName("History User");
        booking.setEmail("history-user@example.com");
        booking.setPhoneNumber("0900000000");
        booking.setAddress("Da Nang");
        booking.setPaymentMethod("paypal");
        booking.setBookingStatus(BookingStatus.PENDING);
        booking = bookingRepository.save(booking);

        History history = new History();
        history.setUser(user);
        history.setTour(tour);
        history.setBooking(booking);
        history.setActionType(ActionType.BOOK);
        history.setTimestamp(LocalDateTime.now());
        historyRepository.save(history);

        Page<HistoryResponseDTO> histories = historyService.getUserHistory(user.getUserID(), null, PageRequest.of(0, 9));

        assertThat(histories.getContent()).hasSize(1);
        HistoryResponseDTO response = histories.getContent().get(0);
        assertThat(response.getTourResponse()).isNotNull();
        assertThat(response.getTourResponse().getImages())
                .extracting("imageURL")
                .contains("history-tour.jpg");
        assertThat(response.getBookingResponse()).isNotNull();
        assertThat(response.getBookingResponse().getBookingStatus()).isEqualTo("PENDING");
    }
}
