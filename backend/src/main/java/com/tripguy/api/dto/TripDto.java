package com.tripguy.api.dto;

import com.tripguy.api.model.Trip;
import lombok.Data;

import java.time.LocalDateTime;

public class TripDto {
    private Long id;
    private String title;
    private String source;
    private String destination;
    private Integer budget;
    private Trip.Visibility visibility;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private String username; // Creator

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public Integer getBudget() {
        return budget;
    }

    public void setBudget(Integer budget) {
        this.budget = budget;
    }

    public Trip.Visibility getVisibility() {
        return visibility;
    }

    public void setVisibility(Trip.Visibility visibility) {
        this.visibility = visibility;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
