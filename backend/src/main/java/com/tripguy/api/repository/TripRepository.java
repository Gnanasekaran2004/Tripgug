package com.tripguy.api.repository;

import com.tripguy.api.model.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {
    List<Trip> findByVisibility(Trip.Visibility visibility);
    List<Trip> findByUserId(Long userId);
    List<Trip> findByVisibilityOrUserId(Trip.Visibility visibility, Long userId);
}
