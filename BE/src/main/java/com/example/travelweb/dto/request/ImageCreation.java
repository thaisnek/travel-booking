package com.example.travelweb.dto.request;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Data
@Getter
@Setter
public class ImageCreation {
    private String imageURL;
    private String description;
}
