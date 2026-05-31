package com.example.travelweb.service.implement;

import com.example.travelweb.converter.ImageMapper;
import com.example.travelweb.converter.TimelineMapper;
import com.example.travelweb.converter.TourMapper;
import com.example.travelweb.dto.request.TimelineCreation;
import com.example.travelweb.dto.request.TourCreation;
import com.example.travelweb.dto.request.TourRequest;
import com.example.travelweb.dto.response.TourDetailResponse;
import com.example.travelweb.dto.response.TourResponse;
import com.example.travelweb.dto.response.TourResponseWrapper;
import com.example.travelweb.entity.Image;
import com.example.travelweb.entity.Review;
import com.example.travelweb.entity.Timeline;
import com.example.travelweb.entity.Tour;
import com.example.travelweb.repository.ImageRepository;
import com.example.travelweb.repository.ReviewRepository;
import com.example.travelweb.repository.TimelineRepository;
import com.example.travelweb.repository.TourRepository;
import com.example.travelweb.service.TourService;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TourServiceImpl implements TourService {

    private static final Logger log = LoggerFactory.getLogger(TourServiceImpl.class);
    private static final Set<String> ALLOWED_IMAGE_EXTENSIONS = Set.of("jpg", "jpeg", "png", "gif", "webp");

    private final TourRepository tourRepository;
    private final TimelineRepository timelineRepository;
    private final ImageRepository imageRepository;
    private final TourMapper tourMapper;
    private final TimelineMapper timelineMapper;
    private final ImageMapper imageMapper;
    private final RestTemplate restTemplate;
    private final ReviewRepository reviewRepository;

    @Value("${tour.upload.dir}")
    private String imageUploadDir;

    @Value("${app.flask-api-url}")
    private String flaskApiUrl;

    @Override
    @Transactional
    public TourResponse createTour(TourCreation tourCreation) {
        Tour tour = tourMapper.toEntity(tourCreation);

        if (tour.getTimeLines() != null) {
            for (Timeline timeline : tour.getTimeLines()) {
                timeline.setTour(tour);
            }
        }

        Tour savedTour = tourRepository.save(tour);
        return tourMapper.toTourResponseDTO(savedTour);
    }

    @Override
    @Transactional
    public List<String> uploadTourImages(Long tourId, MultipartFile[] imageFiles, boolean replaceOldImages) {
        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new RuntimeException("Tour not found with ID: " + tourId));

        if (replaceOldImages) {
            List<Image> oldImages = tour.getImages();
            for (Image oldImage : oldImages) {
                Path oldFilePath = Paths.get(imageUploadDir, oldImage.getImageURL());
                try {
                    if (Files.exists(oldFilePath)) {
                        Files.delete(oldFilePath);
                    }
                } catch (IOException e) {
                    log.error("Không thể xóa ảnh cũ: {}", e.getMessage());
                    throw new RuntimeException("Không thể xóa ảnh cũ: " + e.getMessage());
                }
            }
            tour.getImages().clear();
            tourRepository.save(tour);
        }

        List<String> fileNames = new ArrayList<>();

        if (imageFiles != null && imageFiles.length > 0) {
            for (MultipartFile imageFile : imageFiles) {
                if (!imageFile.isEmpty()) {
                    // Sanitize filename — dùng UUID thay vì originalFilename
                    String originalFilename = imageFile.getOriginalFilename();
                    String extension = getSafeImageExtension(originalFilename);
                    String fileName = UUID.randomUUID() + "." + extension;
                    Path filePath = Paths.get(imageUploadDir, fileName);

                    try {
                        Files.createDirectories(filePath.getParent());
                        Files.write(filePath, imageFile.getBytes());

                        Image image = new Image();
                        image.setImageURL(fileName);
                        image.setTour(tour);
                        imageRepository.save(image);

                        fileNames.add(fileName);
                    } catch (IOException e) {
                        log.error("Không thể lưu ảnh cho tour: {}", e.getMessage());
                        throw new RuntimeException("Không thể lưu ảnh cho tour: " + e.getMessage());
                    }
                }
            }
        }
        return fileNames;
    }

    private Integer calculateAverageRating(List<Review> reviews) {
        if (reviews == null || reviews.isEmpty()) {
            return 0;
        }

        double average = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);

        return (int) Math.round(average);
    }

    @Override
    @Transactional(readOnly = true)
    public TourDetailResponse getTourDetails(Long tourID) {
        Tour tour = tourRepository.findById(tourID)
                .orElseThrow(() -> new RuntimeException("Tour not found"));
        List<Timeline> timelines = timelineRepository.findByTourTourID(tourID);
        List<Image> images = imageRepository.findByTourTourID(tourID);

        TourDetailResponse tourDetailResponseDTO = tourMapper.toTourDetailResponseDTO(tour);
        tourDetailResponseDTO.setTimelines(timelineMapper.toTimelineResponseDTOList(timelines));
        tourDetailResponseDTO.setImages(imageMapper.toImageResponseDTOList(images));

        Integer avgRating = calculateAverageRating(tour.getReviews());
        tourDetailResponseDTO.setAverageRating(avgRating);

        return tourDetailResponseDTO;
    }

    @Override
    @Transactional(readOnly = true)
    public List<TourResponse> getLimitedTours() {
        // Fix N+1: dùng Pageable trực tiếp thay vì findAll().limit()
        Pageable pageable = PageRequest.of(0, 8);
        Page<Tour> tours = tourRepository.findByAvailabilityTrue(pageable);

        return tours.getContent().stream()
                .map(tour -> {
                    TourResponse tourResponse = tourMapper.toTourResponseDTO(tour);
                    Integer avgRating = calculateAverageRating(tour.getReviews());
                    tourResponse.setAverageRating(avgRating);
                    return tourResponse;
                })
                .toList();
    }

    @Override
    @Transactional
    public void updateTourQuantity(Long tourId, int newQuantity) {
        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new IllegalArgumentException("Tour không tồn tại"));
        if (newQuantity < 0) {
            throw new IllegalStateException("Sức chứa tour không thể âm");
        }
        tour.setQuantity(newQuantity);
        tourRepository.save(tour);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TourResponse> getTourRecommendations(Long tourId) {
        String apiUrl = UriComponentsBuilder.fromUriString(flaskApiUrl)
                .path("/api/tour-recommendations")
                .queryParam("tour_id", tourId)
                .toUriString();
        try {
            RelatedToursResponse response = restTemplate.getForObject(apiUrl, RelatedToursResponse.class);
            List<Long> relatedTourIds = response != null ? response.getRelatedTours() : Collections.emptyList();
            if (relatedTourIds.isEmpty()) {
                return getRecommendationFallback(tourId);
            }
            List<Tour> tours = tourRepository.findByTourIDInAndAvailabilityTrue(relatedTourIds);
            return tours.stream()
                    .map(tourMapper::toTourResponseDTO)
                    .toList();
        } catch (Exception e) {
            log.error("Lỗi khi gọi API Python: {}", e.getMessage());
            return getRecommendationFallback(tourId);
        }
    }

    private List<TourResponse> getRecommendationFallback(Long tourId) {
        return tourRepository.findAvailableRecommendationFallback(tourId, PageRequest.of(0, 3)).stream()
                .map(tourMapper::toTourResponseDTO)
                .toList();
    }

    @Setter
    static class RelatedToursResponse {
        private List<Long> related_tours;

        public List<Long> getRelatedTours() {
            return related_tours;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TourResponse> filterTours(Map<String, Object> conditions, Pageable pageable) {
        Long minPrice = (Long) conditions.get("minPrice");
        Long maxPrice = (Long) conditions.get("maxPrice");
        String domain = (String) conditions.get("domain");
        String duration = (String) conditions.get("duration");

        Integer star = (Integer) conditions.get("star");
        List<Long> tourIds = null;
        if (star != null) {
            tourIds = reviewRepository.findTourIdsByAverageRating(star);
            if (tourIds.isEmpty()) {
                return Page.empty(pageable);
            }
        }

        Page<Tour> tours = tourRepository.filterTours(minPrice, maxPrice, domain, duration, tourIds, pageable);

        return tours.map(tour -> {
            TourResponse tourResponse = tourMapper.toTourResponseDTO(tour);
            Integer avgRating = calculateAverageRating(tour.getReviews());
            tourResponse.setAverageRating(avgRating);
            return tourResponse;
        });
    }

    @Override
    @Transactional(readOnly = true)
    public TourResponseWrapper<List<TourResponse>> searchTours(String destination, LocalDate startDate, LocalDate endDate) {
        try {
            List<Tour> tours = tourRepository.findToursByCriteria(destination, startDate, endDate);
            List<TourResponse> tourResponses = tourMapper.toTourResponseDTOList(tours);
            return new TourResponseWrapper<>(true, "Tours retrieved successfully", tourResponses);
        } catch (Exception e) {
            log.error("Error searching tours: {}", e.getMessage());
            return new TourResponseWrapper<>(false, "Error retrieving tours: " + e.getMessage(), null);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TourResponse> getAllTours(Pageable pageable) {
        return tourRepository.findAll(pageable)
                .map(tourMapper::toTourResponseDTO);
    }

    @Override
    @Transactional
    public TourResponse updateTour(Long id, TourRequest request) {
        Tour tour = tourRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tour not found"));

        tour.setTitle(request.getTitle());
        tour.setDescription(request.getDescription());
        tour.setDuration(request.getDuration());
        tour.setQuantity(request.getQuantity());
        tour.setPriceAdult(request.getPriceAdult());
        tour.setPriceChild(request.getPriceChild());
        tour.setDestination(request.getDestination());
        tour.setDomain(request.getDomain());
        tour.setAvailability(request.isAvailability());
        tour.setStartDate(request.getStartDate());
        tour.setEndDate(request.getEndDate());

        tour.getTimeLines().clear();
        if (request.getTimelines() != null) {
            for (TimelineCreation t : request.getTimelines()) {
                Timeline timeline = new Timeline();
                timeline.setDay(t.getDay());
                timeline.setDescription(t.getDescription());
                timeline.setTour(tour);
                tour.getTimeLines().add(timeline);
            }
        }

        tour = tourRepository.save(tour);
        return tourMapper.toTourResponseDTO(tour);
    }

    @Override
    @Transactional
    public void deleteTour(Long id) {
        Tour tour = tourRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tour not found"));
        tour.setAvailability(false);
        tourRepository.save(tour);
    }

    private String getSafeImageExtension(String originalFilename) {
        if (originalFilename == null || !originalFilename.contains(".")) {
            return "jpg";
        }

        String extension = originalFilename.substring(originalFilename.lastIndexOf(".") + 1).toLowerCase();
        if (!ALLOWED_IMAGE_EXTENSIONS.contains(extension)) {
            throw new IllegalArgumentException("Định dạng ảnh không được hỗ trợ");
        }
        return extension;
    }
}
