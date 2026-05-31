package com.example.travelweb;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class TravelwebApplication {

    public static void main(String[] args) {
        SpringApplication.run(TravelwebApplication.class, args);
    }

}
