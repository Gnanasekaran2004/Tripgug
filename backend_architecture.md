# Part 2: Backend Architecture (Spring Boot)

## Overview
The **tripGUY** backend is designed as a monolithic Spring Boot application for simplicity and zero-cost hosting (e.g., on Render's free tier or similar). It uses **Java 17** and follows a standard layered architecture.

## 1. Project Structure
```text
com.tripguy.api
├── config
│   ├── SecurityConfig.java      // JWT & CORS configuration
│   ├── WebSocketConfig.java     // STOMP endpoint registration
├── controller
│   ├── AuthController.java      // Login/Register endpoints
│   ├── TripController.java      // CRUD for trips
│   ├── TrackingController.java  // WebSocket & REST tracking endpoints
├── dto
│   ├── AuthRequest.java
│   ├── TripDto.java
│   ├── LocationUpdate.java
├── model (Entity)
│   ├── User.java
│   ├── Trip.java
│   ├── TrackingLog.java
├── repository
│   ├── UserRepository.java
│   ├── TripRepository.java
├── service
│   ├── AuthService.java
│   ├── TripService.java
│   ├── TrackingService.java
└── security
    ├── JwtTokenProvider.java
    ├── JwtAuthenticationFilter.java
```

## 2. Database Schema (PostgreSQL / MySQL)
Designed for relational integrity.

### Tables
1.  **users**
    *   `id` (BIGINT, PK, Auto Inc)
    *   `username` (VARCHAR, Unique)
    *   `email` (VARCHAR, Unique)
    *   `password_hash` (VARCHAR)
    *   `created_at` (TIMESTAMP)

2.  **trips**
    *   `id` (BIGINT, PK)
    *   `user_id` (BIGINT, FK -> users.id)
    *   `title` (VARCHAR)
    *   `source` (VARCHAR)
    *   `destination` (VARCHAR)
    *   `budget` (INT)
    *   `visibility` (ENUM: 'PUBLIC', 'PRIVATE')
    *   `is_active` (BOOLEAN) // For live tracking

3.  **tracking_logs** (Optional: For history playback)
    *   `id` (BIGINT, PK)
    *   `trip_id` (BIGINT, FK -> trips.id)
    *   `latitude` (DOUBLE)
    *   `longitude` (DOUBLE)
    *   `timestamp` (TIMESTAMP)

## 3. Real-Time Tracking ("Free Forever" Solution)
We avoid Google Maps API costs by using **OpenStreetMap (OSM)** on the frontend (Leaflet.js) and **WebSockets** on the backend.

### WebSocket Configuration (STOMP)
**File:** `WebSocketConfig.java`
```java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic"); // Push to clients
        config.setApplicationDestinationPrefixes("/app"); // Receive from clients
    }
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws-tracking").setAllowedOrigins("*").withSockJS();
    }
}
```

### Flow
1.  **Driver/Traveler**: Frontend captures `navigator.geolocation` and sends JSON to `/app/track/{tripId}` via STOMP.
2.  **Server**: `TrackingController` receives the coordinate, saves it asynchronously (optional), and broadcasts it to `/topic/trip/{tripId}`.
3.  **Viewer**: Frontend subscribes to `/topic/trip/{tripId}` and updates the Leaflet marker `setLatLng`.

## 4. Security (JWT)
*   **Stateless Auth**: No server-side sessions.
*   **Login**: Returns a `Bearer` token.
*   **Filter**: Intercepts requests, validates token signature, sets `SecurityContext`.
*   **Passwords**: BCrypt encoded.

---

# Part 3: Technology Stack Analysis

## Why Spring Boot?
1.  **Enterprise Standard**: Spring Boot is the industry standard for Java backends, offering immense ecosystem support.
2.  **Strict Structure**: Enforces a clean separation of concerns (Controller-Service-Repository), making the codebase maintainable for long-term projects.
3.  **Security**: Spring Security is battle-tested and far more robust out-of-the-box compared to Express middlewares.
4.  **Java vs. NoSQL**:
    *   **Relationships matter**: A User *has many* Trips. Trips *have many* Logs. This is inherently relational. SQL enforces integrity (Foreign Keys).
    *   **Scale**: SQL databases (PostgreSQL) scale vertically very well and are cheaper to host reliably on free tiers (like Supabase or Neon) compared to MongoDB Atlas limits.

## Alternative "Free Forever" Stacks

### 1. Spring Boot vs. MERN Stack
*   **MERN (MongoDB, Express, React, Node)**:
    *   *Pros*: One language (JS/TS), rapid prototyping, JSON native.
    *   *Cons*: Loose architecture leads to "spaghetti code" in large user bases. MongoDB relationships are manual (no real joins).
    *   *Verdict*: Good for hackathons, but Spring Boot wins for structured longevity.

### 2. Spring Boot vs. Flutter + BaaS (Supabase/Appwrite)
*   **BaaS**:
    *   *Pros*: extremely fast setup. Real-time built-in.
    *   *Cons*: Vendor lock-in. Custom business logic (complex budget calculations, generated reports) becomes hard to implement in "Edge Functions".
    *   *Verdict*: Best for solo founders who want to skip backend code entirely.

### 3. Spring Boot vs. Next.js (Fullstack)
*   **Next.js**:
    *   *Pros*: Unified frontend/backend, serverless deployment (Vercel).
    *   *Cons*: Serverless functions have "cold starts" (bad for real-time WebSockets). WebSockets on Vercel are complex/expensive (need Pusher/Ably).
    *   *Verdict*: Bad for *this specific* real-time tracking use case due to WebSocket limitations in serverless environments.

## Final Recommendations

### Best for Student Project: **MERN Stack**
*   Easier learning curve if you already know React.
*   "Good enough" structure for grading.

### Best for Startup MVP: **Flutter + Supabase**
*   Cross-platform mobile app (iOS/Android) is crucial for travel apps (more than Web).
*   Supabase handles Auth/DB/Realtime for free.

### Best for Long-term Scalable Application: **Spring Boot + React** (The implementation chosen)
*   **Separation of concerns**: Frontend and Backend scale independently.
*   **Type Safety**: Java is robust.
*   **Performance**: JVM is highly optimized for high-throughput (handling thousands of GPS pings).
