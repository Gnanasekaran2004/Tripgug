import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navigation from './Navigation';
import Chatbot from './Chatbot';

const Layout = () => {
    const location = useLocation();
    // Hide bottom nav on login page if needed, but requirements say Chatbot on EVERY screen.
    // Nav might not be needed on Login, but commonly used in mobile apps.
    // Actually, usually Login is separate.
    // I'll conditionally render Navigation if not on /login
    const showNav = location.pathname !== '/login';

    return (
        <div className="container">
            <main style={{ paddingBottom: showNav ? '20px' : '0' }}>
                <Outlet />
            </main>

            {showNav && <Navigation />}
        </div>
    );
};

export default Layout;
