import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LoginRegister from './pages/LoginRegister';
import Home from './pages/Home';
import NewTrip from './pages/NewTrip';
import History from './pages/History';
import Profile from './pages/Profile';
import Tracking from './pages/Tracking';

import Chatbot from './components/Chatbot';

function App() {
  return (
    <BrowserRouter>
      <Chatbot />
      <Routes>
        <Route path="/login" element={<LoginRegister />} />

        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/new" element={<NewTrip />} />
          <Route path="/history" element={<History />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/tracking" element={<Tracking />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
