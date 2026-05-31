package com.example.travelweb.controller.Admin;

import com.example.travelweb.dto.api.ApiResponse;
import com.example.travelweb.dto.request.TourCreation;
import com.example.travelweb.dto.request.TourRequest;
import com.example.travelweb.dto.response.TourResponse;
import com.example.travelweb.service.TourService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/tours")
@RequiredArgsConstructor
public class AdminTourController {

    private final TourService tourService;

    @PostMapping("/create")
    public ResponseEntity<TourResponse> createTour(@Valid @RequestBody TourCreation tourRequestDTO) {
        TourResponse createdTour = tourService.createTour(tourRequestDTO);
        return ResponseEntity.status(201).body(createdTour);
    }

    @PostMapping(value = "/{tourId}/upload-images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<List<String>>> uploadTourImages(
            @PathVariable Long tourId,
            @RequestPart("images") MultipartFile[] imageFiles,
            @RequestParam(value = "replaceOldImages", defaultValue = "true") boolean replaceOldImages) {
        if (imageFiles == null || imageFiles.length == 0) {
            return ResponseEntity.badRequest().body(
                    ApiResponse.<List<String>>builder()
                            .code(400)
                            .message("Vui lòng chọn ít nhất một file ảnh!")
                            .build()
            );
        }

        for (MultipartFile file : imageFiles) {
            if (!file.isEmpty()) {
                String contentType = file.getContentType();
                if (contentType == null || !contentType.startsWith("image/")) {
                    return ResponseEntity.badRequest().body(
                            ApiResponse.<List<String>>builder()
                                    .code(400)
                                    .message("File phải là ảnh (jpeg, png, jpg, gif)!")
                                    .build()
                    );
                }
                if (file.getSize() > 5 * 1024 * 1024) {
                    return ResponseEntity.badRequest().body(
                            ApiResponse.<List<String>>builder()
                                    .code(400)
                                    .message("Kích thước ảnh không được vượt quá 5MB!")
                                    .build()
                    );
                }
            }
        }

        List<String> fileNames = tourService.uploadTourImages(tourId, imageFiles, replaceOldImages);
        return ResponseEntity.ok(
                ApiResponse.<List<String>>builder()
                        .code(200)
                        .message("Upload ảnh thành công!")
                        .result(fileNames.stream().map(name -> "/ltweb/images/tour/" + name).collect(Collectors.toList()))
                        .build()
        );
    }

    @GetMapping
    public Page<TourResponse> getAllTours(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return tourService.getAllTours(pageable);
    }

    @PutMapping("/update/{id}")
    public TourResponse updateTour(
            @PathVariable Long id,
            @Valid @RequestBody TourRequest request) {
        return tourService.updateTour(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteTour(@PathVariable Long id) {
        tourService.deleteTour(id);
    }
}
