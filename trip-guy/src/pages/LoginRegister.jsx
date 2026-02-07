import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../services/api';

const LoginRegister = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await authService.login(formData.username, formData.password);
                navigate('/');
            } else {
                await authService.register(formData.username, formData.email, formData.password);
                alert('Registration successful! Please login.');
                setIsLogin(true);
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1 className="text-primary" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>tripGUY</h1>
                <p className="text-muted">Your ultimate low-cost travel companion.</p>
            </div>

            <div className="card fade-in">
                <div style={{ display: 'flex', marginBottom: '1.5rem', background: '#f1f5f9', padding: '4px', borderRadius: '12px' }}>
                    <button
                        onClick={() => { setIsLogin(true); setError(''); }}
                        style={{
                            flex: 1,
                            border: 'none',
                            background: isLogin ? 'white' : 'transparent',
                            padding: '10px',
                            borderRadius: '8px',
                            fontWeight: '600',
                            color: isLogin ? 'var(--primary)' : 'var(--text-muted)',
                            boxShadow: isLogin ? 'var(--shadow-sm)' : 'none',
                            transition: 'all 0.2s',
                            cursor: 'pointer'
                        }}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => { setIsLogin(false); setError(''); }}
                        style={{
                            flex: 1,
                            border: 'none',
                            background: !isLogin ? 'white' : 'transparent',
                            padding: '10px',
                            borderRadius: '8px',
                            fontWeight: '600',
                            color: !isLogin ? 'var(--primary)' : 'var(--text-muted)',
                            boxShadow: !isLogin ? 'var(--shadow-sm)' : 'none',
                            transition: 'all 0.2s',
                            cursor: 'pointer'
                        }}
                    >
                        Register
                    </button>
                </div>

                {error && <div style={{ color: 'red', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isLogin ? 'login' : 'register'}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="input-group">
                                <label className="input-label">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="Choose a username"
                                    required
                                />
                            </div>

                            {!isLogin && (
                                <div className="input-group">
                                    <label className="input-label">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="your@email.com"
                                        required
                                    />
                                </div>
                            )}

                            <div className="input-group">
                                <label className="input-label">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '1rem' }} disabled={loading}>
                        {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
                    </button>
                </form>
            </div>

            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '600', marginLeft: '4px', cursor: 'pointer' }}
                    >
                        {isLogin ? 'Register' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginRegister;
