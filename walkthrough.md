# tripGUY - Enterprise Edition

## Overview
This is the fully functional, "Zero Mocking" Enterprise Edition of **tripGUY**. 
It features a **Spring Boot 3** backend, **PostgreSQL** database, and a **React** frontend using real-time **WebSockets**.

## Project Structure
- **`backend/`**: Spring Boot Application.
  - **Security**: JWT Authentication (Stateless).
  - **Database**: JPA/Hibernate with PostgreSQL.
  - **Real-Time**: STOMP over WebSockets.
- **`trip-guy/`**: React Frontend.
  - **API**: Centralized `api.js` using Axios.
  - **State**: Real-time location sync.

## Infrastructure
The project is containerized using Docker Compose.

### Running the Application
1.  **Start Services**:
    ```bash
    docker-compose up --build
    ```
    This will start:
    - **PostgreSQL** on port `5432`
    - **Spring Boot Backend** on port `8080`

2.  **Start Frontend**:
    ```bash
    cd trip-guy
    npm install
    npm run dev
    ```
    Access at: `http://localhost:5173`

## Features
1.  **Authentication**: Register and Login with real DB persistence.
2.  **Trips**: Create and View trips (Public/Private) stored in SQL.
3.  **Live Tracking**: 
    - Click "Live" on a trip.
    - Updates are pushed via WebSockets to all connected clients.
    - Coordinates are saved to `trip_logs`.

## Zero Mocking Policy
- All dummy data has been removed.
- `AuthContext` token management implemented.
- Error handling integration checks 401 Unauthorized status.
