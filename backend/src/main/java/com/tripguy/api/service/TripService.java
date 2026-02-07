package com.tripguy.api.service;

import com.tripguy.api.dto.TripDto;
import com.tripguy.api.model.Trip;
import com.tripguy.api.model.User;
import com.tripguy.api.repository.TripRepository;
import com.tripguy.api.repository.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TripService {

    private final TripRepository tripRepository;
    private final UserRepository userRepository;

    public TripService(TripRepository tripRepository, UserRepository userRepository) {
        this.tripRepository = tripRepository;
        this.userRepository = userRepository;
    }

    public List<TripDto> getAllTrips(String currentUsername) {
        // Fetch Public trips OR Private trips belonging to current user
        User user = userRepository.findByUsername(currentUsername).orElseThrow();
        List<Trip> trips = tripRepository.findByVisibilityOrUserId(Trip.Visibility.PUBLIC, user.getId());
        return trips.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    public TripDto createTrip(TripDto tripDto, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Trip trip = new Trip();
        trip.setUser(user);
        trip.setTitle(tripDto.getTitle());
        trip.setSource(tripDto.getSource());
        trip.setDestination(tripDto.getDestination());
        trip.setBudget(tripDto.getBudget());
        trip.setVisibility(tripDto.getVisibility());
        trip.setIsActive(false);

        Trip savedTrip = tripRepository.save(trip);
        return convertToDto(savedTrip);
    }

    public TripDto convertToDto(Trip trip) {
        TripDto dto = new TripDto();
        dto.setId(trip.getId());
        dto.setTitle(trip.getTitle());
        dto.setSource(trip.getSource());
        dto.setDestination(trip.getDestination());
        dto.setBudget(trip.getBudget());
        dto.setVisibility(trip.getVisibility());
        dto.setIsActive(trip.getIsActive());
        dto.setCreatedAt(trip.getCreatedAt());
        dto.setUsername(trip.getUser().getUsername());
        return dto;
    }
}
