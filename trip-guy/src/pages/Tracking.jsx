import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Play, Pause } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { Client } from '@stomp/stompjs';
import { tripService } from '../services/api';

// Fix for Leaflet marker icons in React
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const Tracking = () => {
    const [isTracking, setIsTracking] = useState(false);
    const [position, setPosition] = useState(null); // Wait for real fix
    const [activeTrip, setActiveTrip] = useState(null);
    const [statusMsg, setStatusMsg] = useState('Finding active trip...');
    const clientRef = useRef(null);

    // 1. Find an Active Trip
    useEffect(() => {
        const fetchActiveTrip = async () => {
            try {
                const response = await tripService.getAll();
                // Find first active trip or just the latest one to simulate
                // In a real app, you'd select which one to track.
                // For this demo, we pick the most recent trip created.
                const trips = response.data;
                if (trips.length > 0) {
                    const latest = trips[trips.length - 1]; // Pick latest
                    setActiveTrip(latest);
                    setStatusMsg(`Ready to track: ${latest.title}`);
                    // Default start pos (e.g. London or 0,0 if unknown)
                    setPosition([51.505, -0.09]);
                } else {
                    setStatusMsg('No trips found. Create one first.');
                }
            } catch (err) {
                console.error(err);
                setStatusMsg('Error fetching trips.');
            }
        };
        fetchActiveTrip();
    }, []);

    // 2. Setup WebSocket
    useEffect(() => {
        if (!activeTrip) return;

        const client = new Client({
            brokerURL: 'ws://localhost:8080/ws-tracking',
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            debug: (str) => {
                console.log('STOMP: ' + str);
            },
            onConnect: () => {
                console.log('Connected to WS');
                // Subscribe to updates for this trip
                client.subscribe(`/topic/tracking/${activeTrip.id}`, (message) => {
                    const body = JSON.parse(message.body);
                    setPosition([body.latitude, body.longitude]);
                });
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            },
            onWebSocketError: (event) => {
                console.error('WebSocket error observed:', event);
            },
            onDisconnect: () => {
                console.log('Disconnected from WS');
            }
        });

        client.activate();
        clientRef.current = client;

        return () => {
            client.deactivate();
        };
    }, [activeTrip]);

    // 3. Simulate GPS Movement (Producer)
    useEffect(() => {
        let interval;
        if (isTracking && activeTrip && clientRef.current && clientRef.current.connected) {
            interval = setInterval(() => {
                // Simulate moving
                if (!position) return;

                const newLat = position[0] + (Math.random() - 0.5) * 0.001;
                const newLng = position[1] + (Math.random() - 0.5) * 0.001;

                const payload = {
                    latitude: newLat,
                    longitude: newLng
                };

                clientRef.current.publish({
                    destination: `/app/track/${activeTrip.id}`,
                    body: JSON.stringify(payload)
                });
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [isTracking, activeTrip, position]);

    if (!position) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>{statusMsg}</div>;
    }

    return (
        <div style={{ height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '1rem', background: 'white', zIndex: 10, boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h2>Live Tracking</h2>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: isTracking ? '#ecfdf5' : '#fef2f2',
                        padding: '4px 12px',
                        borderRadius: '16px',
                        color: isTracking ? '#059669' : '#dc2626',
                        fontSize: '0.875rem',
                        fontWeight: '600'
                    }}>
                        <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: 'currentColor',
                            animation: isTracking ? 'pulse 1.5s infinite' : 'none'
                        }} />
                        {isTracking ? 'LIVE' : 'OFFLINE'}
                    </div>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    {activeTrip ? `Tracking: ${activeTrip.title}` : 'Select a trip'}
                </div>
            </div>

            <div style={{ flex: 1, position: 'relative' }}>
                <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={position}>
                        <Popup>
                            Current Location
                        </Popup>
                    </Marker>
                </MapContainer>

                <button
                    onClick={() => setIsTracking(!isTracking)}
                    className="btn"
                    style={{
                        position: 'absolute',
                        bottom: '20px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 1000,
                        background: isTracking ? '#dc2626' : '#059669',
                        color: 'white',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        minWidth: '180px'
                    }}
                    disabled={!activeTrip}
                >
                    {isTracking ? (
                        <>
                            <Pause size={20} style={{ marginRight: '8px' }} />
                            Stop Tracking
                        </>
                    ) : (
                        <>
                            <Play size={20} style={{ marginRight: '8px' }} />
                            Start Tracking
                        </>
                    )}
                </button>
            </div>
            <style>{`
                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.5; }
                    100% { opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default Tracking;
