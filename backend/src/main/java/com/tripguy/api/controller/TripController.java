package com.tripguy.api.controller;

import com.tripguy.api.dto.TripDto;
import com.tripguy.api.service.TripService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
public class TripController {

    private final TripService tripService;

    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    @GetMapping
    public ResponseEntity<List<TripDto>> getTrips(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(tripService.getAllTrips(userDetails.getUsername()));
    }

    @PostMapping
    public ResponseEntity<TripDto> createTrip(@RequestBody TripDto tripDto,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(tripService.createTrip(tripDto, userDetails.getUsername()));
    }
}
