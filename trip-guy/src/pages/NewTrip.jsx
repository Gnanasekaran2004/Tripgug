import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { tripService } from '../services/api';

const NewTrip = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        source: '',
        destination: '',
        budget: '',
        visibility: 'PUBLIC'
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await tripService.create(formData);
            navigate('/');
        } catch (error) {
            console.error("Error creating trip", error);
            alert("Failed to create trip.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--text-main)' }}>
                    <ArrowLeft size={24} />
                </button>
                <h2 style={{ marginLeft: '1rem' }}>Plan New Trip</h2>
            </div>

            <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="input-group">
                    <label className="input-label">Trip Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="e.g. Summer Vacation"
                        required
                    />
                </div>

                <div className="input-group">
                    <label className="input-label">Source</label>
                    <input
                        type="text"
                        name="source"
                        value={formData.source}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Where are you starting?"
                        required
                    />
                </div>

                <div className="input-group">
                    <label className="input-label">Destination</label>
                    <input
                        type="text"
                        name="destination"
                        value={formData.destination}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Where do you want to go?"
                        required
                    />
                </div>

                <div className="input-group">
                    <label className="input-label">Budget ($)</label>
                    <input
                        type="number"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Estimated cost"
                        required
                        min="0"
                    />
                </div>

                <div className="input-group">
                    <label className="input-label">Visibility</label>
                    <select
                        name="visibility"
                        value={formData.visibility}
                        onChange={handleChange}
                        className="input-field"
                        style={{ appearance: 'none' }}
                    >
                        <option value="PUBLIC">Public (Everyone can see)</option>
                        <option value="PRIVATE">Private (Only me)</option>
                    </select>
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                    <button type="button" onClick={() => navigate('/')} className="btn btn-block" style={{ background: '#f1f5f9', color: 'var(--text-muted)' }}>
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        <Save size={18} style={{ marginRight: '8px' }} />
                        {loading ? 'Publishing...' : 'Publish Trip'}
                    </button>
                </div>
            </motion.form>
        </div>
    );
};

export default NewTrip;
