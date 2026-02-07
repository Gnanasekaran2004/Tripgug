import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Map, Receipt, User } from 'lucide-react';

const Navigation = () => {
  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Receipt, label: 'History', path: '/history' },
    { icon: Map, label: 'Live', path: '/tracking' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <NavLink
          key={item.label}
          to={item.path}
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <item.icon size={24} />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default Navigation;
