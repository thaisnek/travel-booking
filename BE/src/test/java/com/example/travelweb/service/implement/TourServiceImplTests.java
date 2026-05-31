package com.example.travelweb.service.implement;

import com.example.travelweb.dto.request.TimelineCreation;
import com.example.travelweb.dto.request.TourCreation;
import com.example.travelweb.dto.response.TourResponse;
import com.example.travelweb.service.TourService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
class TourServiceImplTests {

    @Autowired
    private TourService tourService;

    @Test
    void getAllToursReturnsCreatedTour() {
        TimelineCreation timeline = new TimelineCreation();
        timeline.setDay(1);
        timeline.setDescription("Start the tour");

        TourCreation request = new TourCreation();
        request.setTitle("Test tour");
        request.setDescription("Test description");
        request.setDuration("1N");
        request.setQuantity(10);
        request.setPriceAdult(1_000_000L);
        request.setPriceChild(500_000L);
        request.setDestination("Ha Noi");
        request.setDomain("Mien Bac");
        request.setAvailability(true);
        request.setStartDate(LocalDate.now().plusDays(1));
        request.setEndDate(LocalDate.now().plusDays(2));
        request.setTimelines(List.of(timeline));

        TourResponse created = tourService.createTour(request);

        Page<TourResponse> tours = tourService.getAllTours(PageRequest.of(0, 9));

        assertThat(tours.getContent())
                .extracting(TourResponse::getTourID)
                .contains(created.getTourID());
    }
}
