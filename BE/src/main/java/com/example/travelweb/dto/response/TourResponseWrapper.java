package com.example.travelweb.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TourResponseWrapper<T> {
    private boolean success;
    private String message;
    private T data;

    public TourResponseWrapper(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }
}
