import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, DollarSign } from 'lucide-react';
import { tripService } from '../services/api';

const History = () => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await tripService.getAll();
                // In a real app, maybe filter by completed or just show all
                setTrips(response.data);
            } catch (error) {
                console.error('Failed to fetch history', error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    return (
        <div style={{ padding: '1.5rem' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Trip History</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {loading ? (
                    <div>Loading history...</div>
                ) : trips.length === 0 ? (
                    <div>No travel history yet.</div>
                ) : (
                    trips.map((trip, index) => (
                        <motion.div
                            key={trip.id}
                            className="card"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            style={{ padding: '1rem' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontWeight: '600' }}>{trip.source} ➝ {trip.destination}</span>
                                <span style={{
                                    fontSize: '0.75rem',
                                    padding: '2px 8px',
                                    borderRadius: '12px',
                                    background: trip.isActive ? '#dcfce7' : '#f1f5f9',
                                    color: trip.isActive ? '#166534' : '#64748b',
                                }}>
                                    {trip.isActive ? 'Active' : 'Planned'}
                                </span>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Calendar size={14} />
                                    {new Date(trip.createdAt).toLocaleDateString()}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <DollarSign size={14} />
                                    {trip.budget}
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default History;
