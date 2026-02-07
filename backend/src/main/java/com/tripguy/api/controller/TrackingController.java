package com.tripguy.api.controller;

import com.tripguy.api.dto.LocationUpdate;
import com.tripguy.api.service.TrackingService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class TrackingController {

    private final TrackingService trackingService;

    public TrackingController(TrackingService trackingService) {
        this.trackingService = trackingService;
    }

    @MessageMapping("/track/{tripId}") // Sent to /app/track/{tripId}
    @SendTo("/topic/tracking/{tripId}") // Broadcast to subscribers
    public LocationUpdate handleLocationUpdate(@DestinationVariable Long tripId, LocationUpdate update) {
        update.setTripId(tripId);
        trackingService.saveLog(update);
        return update; // Returns to /topic...
    }
}
