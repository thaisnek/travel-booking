package com.example.travelweb.dto.response;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class ImageResponse {
    private Long imageID;
    private String imageURL;
    private String description;
}
