import React from 'react';
import { User, Settings, LogOut, Edit } from 'lucide-react';
import { authService } from '../services/api';

const Profile = () => {
    const username = authService.getCurrentUser();

    return (
        <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem', marginTop: '1rem' }}>
                <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: '#e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                    border: '4px solid white',
                    boxShadow: 'var(--shadow-md)'
                }}>
                    <User size={48} color="var(--text-muted)" />
                </div>
                <h2 style={{ marginBottom: '0.25rem' }}>{username || 'Guest'}</h2>
                <p className="text-muted">@{username}</p>
            </div>

            <div className="card" style={{ padding: '0.5rem' }}>
                <button className="btn btn-block" style={{ justifyContent: 'flex-start', background: 'transparent', color: 'var(--text-main)', borderBottom: '1px solid #f1f5f9', borderRadius: 0 }}>
                    <Edit size={20} style={{ marginRight: '1rem' }} />
                    Edit Profile
                </button>
                <button className="btn btn-block" style={{ justifyContent: 'flex-start', background: 'transparent', color: 'var(--text-main)', borderBottom: '1px solid #f1f5f9', borderRadius: 0 }}>
                    <Settings size={20} style={{ marginRight: '1rem' }} />
                    App Preferences
                </button>
                <button
                    onClick={authService.logout}
                    className="btn btn-block"
                    style={{ justifyContent: 'flex-start', background: 'transparent', color: '#ef4444', borderRadius: 0 }}
                >
                    <LogOut size={20} style={{ marginRight: '1rem' }} />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Profile;
