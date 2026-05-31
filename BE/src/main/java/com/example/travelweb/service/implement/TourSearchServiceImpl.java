package com.example.travelweb.service.implement;

import com.example.travelweb.converter.TourMapper;
import com.example.travelweb.dto.response.TourResponse;
import com.example.travelweb.entity.Tour;
import com.example.travelweb.repository.TourRepository;
import com.example.travelweb.service.TourSearchService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TourSearchServiceImpl implements TourSearchService {

    private static final Logger logger = LoggerFactory.getLogger(TourSearchService.class);

    private final TourRepository tourRepository;
    private final TourMapper tourMapper;
    private final RestTemplate restTemplate;

    @Value("${app.flask-api-url}")
    private String flaskApiUrl;

    @Transactional(readOnly = true)
    public List<TourResponse> searchTours(String keyword) {
        URI apiUri = UriComponentsBuilder.fromUriString(flaskApiUrl)
                .path("/api/search-tours")
                .queryParam("keyword", keyword)
                .encode(StandardCharsets.UTF_8)
                .build()
                .toUri();
        try {
            logger.info("Calling Flask search API: {}", apiUri);
            RelatedToursResponse response = restTemplate.getForObject(apiUri, RelatedToursResponse.class);
            List<Long> relatedTourIds = response != null && response.getRelatedTours() != null
                    ? response.getRelatedTours()
                    : Collections.emptyList();

            if (relatedTourIds.isEmpty()) {
                logger.warn("No tours found for keyword: {}", keyword);
                return Collections.emptyList();
            }

            List<Tour> tours = tourRepository.findByTourIDInAndAvailabilityTrue(relatedTourIds);
            return tours.stream()
                    .map(tourMapper::toTourResponseDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error calling Flask search API for keyword {}: {}", keyword, e.getMessage(), e);
            return tourRepository.searchAvailableToursFallback(keyword, PageRequest.of(0, 9)).stream()
                    .map(tourMapper::toTourResponseDTO)
                    .collect(Collectors.toList());
        }
    }

    @Data
    static class RelatedToursResponse {
        private List<Long> related_tours;

        public List<Long> getRelatedTours() {
            return related_tours;
        }
    }
}
