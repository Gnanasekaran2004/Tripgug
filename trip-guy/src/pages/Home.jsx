import React, { useState, useEffect } from 'react';
import { Plus, Users, Lock, Calendar, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { tripService, authService } from '../services/api';

const Home = () => {
    const [activeTab, setActiveTab] = useState('public');
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const username = authService.getCurrentUser();

    useEffect(() => {
        fetchTrips();
    }, []);

    const fetchTrips = async () => {
        try {
            const response = await tripService.getAll();
            setTrips(response.data);
        } catch (error) {
            console.error('Failed to fetch trips', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredTrips = trips.filter(t =>
        activeTab === 'public'
            ? t.visibility === 'PUBLIC'
            : (t.visibility === 'PRIVATE' && t.username === username)
    );

    return (
        <div style={{ paddingBottom: '2rem' }}>
            {/* Header / Notch */}
            <div style={{
                background: 'linear-gradient(to right, var(--primary), var(--secondary))',
                padding: '2rem 1.5rem 3rem',
                borderBottomLeftRadius: '2rem',
                borderBottomRightRadius: '2rem',
                color: 'white',
                boxShadow: 'var(--shadow-md)',
                marginBottom: '1rem'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Welcome back,</div>
                        <h2 style={{ color: 'white' }}>{username || 'Explorer'}</h2>
                    </div>
                    <div style={{ width: '40px', height: '40px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{username ? username.charAt(0).toUpperCase() : 'U'}</span>
                    </div>
                </div>
            </div>

            <div style={{ padding: '0 1.5rem' }}>
                {/* Tabs */}
                <div style={{ display: 'flex', marginBottom: '1.5rem', gap: '1rem' }}>
                    <button
                        onClick={() => setActiveTab('public')}
                        style={{
                            flex: 1,
                            padding: '0.75rem',
                            borderRadius: '1rem',
                            border: 'none',
                            background: activeTab === 'public' ? 'var(--primary)' : 'white',
                            color: activeTab === 'public' ? 'white' : 'var(--text-muted)',
                            fontWeight: '600',
                            boxShadow: activeTab === 'public' ? '0 4px 12px rgba(99, 102, 241, 0.4)' : 'var(--shadow-sm)',
                            transition: 'all 0.2s',
                            cursor: 'pointer'
                        }}
                    >
                        Public Trips
                    </button>
                    <button
                        onClick={() => setActiveTab('private')}
                        style={{
                            flex: 1,
                            padding: '0.75rem',
                            borderRadius: '1rem',
                            border: 'none',
                            background: activeTab === 'private' ? 'var(--primary)' : 'white',
                            color: activeTab === 'private' ? 'white' : 'var(--text-muted)',
                            fontWeight: '600',
                            boxShadow: activeTab === 'private' ? '0 4px 12px rgba(99, 102, 241, 0.4)' : 'var(--shadow-sm)',
                            transition: 'all 0.2s',
                            cursor: 'pointer'
                        }}
                    >
                        My Trips
                    </button>
                </div>

                {/* Trip List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading trips...</div>
                    ) : filteredTrips.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                            No trips found. Start a new one!
                        </div>
                    ) : (
                        filteredTrips.map((trip) => (
                            <motion.div
                                key={trip.id}
                                className="card"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                style={{ padding: '1.25rem' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <h3 style={{ fontSize: '1.125rem' }}>{trip.title}</h3>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        padding: '2px 8px',
                                        borderRadius: '12px',
                                        background: trip.visibility === 'PUBLIC' ? '#e0f2fe' : '#fce7f3',
                                        color: trip.visibility === 'PUBLIC' ? '#0369a1' : '#be185d',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}>
                                        {trip.visibility === 'PUBLIC' ? <Users size={12} /> : <Lock size={12} />}
                                        {trip.visibility}
                                    </span>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                    <MapPin size={16} />
                                    <span>{trip.source} ➝ {trip.destination}</span>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                        <Calendar size={16} />
                                        <span>{new Date(trip.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div style={{ fontWeight: '700', color: 'var(--primary)' }}>
                                        ${trip.budget}
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            {/* FAB */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate('/new')}
                style={{
                    position: 'fixed',
                    bottom: '100px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--secondary), var(--primary))',
                    border: 'none',
                    color: 'white',
                    boxShadow: '0 8px 20px rgba(236, 72, 153, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 40 // Below Nav but above content
                }}
            >
                <Plus size={32} />
            </motion.button>
        </div>
    );
};

export default Home;
