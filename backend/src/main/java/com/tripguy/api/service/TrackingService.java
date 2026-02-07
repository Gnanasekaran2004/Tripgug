package com.tripguy.api.service;

import com.tripguy.api.dto.LocationUpdate;
import com.tripguy.api.model.Trip;
import com.tripguy.api.model.TripLog;
import com.tripguy.api.repository.TripLogRepository;
import com.tripguy.api.repository.TripRepository;
import org.springframework.stereotype.Service;

@Service
public class TrackingService {

    private final TripLogRepository tripLogRepository;
    private final TripRepository tripRepository;

    public TrackingService(TripLogRepository tripLogRepository, TripRepository tripRepository) {
        this.tripLogRepository = tripLogRepository;
        this.tripRepository = tripRepository;
    }

    public void saveLog(LocationUpdate update) {
        Trip trip = tripRepository.findById(update.getTripId()).orElse(null);
        if (trip != null) {
            TripLog log = new TripLog();
            log.setTrip(trip);
            log.setLatitude(update.getLatitude());
            log.setLongitude(update.getLongitude());
            tripLogRepository.save(log);
        }
    }
}
