import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import useAuthStore from './store';

import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import StreamerPage from './pages/StreamerPage';
import AlertOverlay from './pages/AlertOverlay';

const Protected = ({ children }) => {
  const user = useAuthStore(s => s.user);
  return user ? children : <Navigate to="/login" replace />;
};

export default function App() {
  const fetchMe = useAuthStore(s => s.fetchMe);
  useEffect(() => { fetchMe(); }, []);

  return (
    <>
      <Routes>
        {/* Alert overlay for OBS — no navbar */}
        <Route path="/alert/:username" element={<AlertOverlay />} />

        {/* All other routes with navbar */}
        <Route path="*" element={
          <>
            <Navbar />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
              <Route path="/settings" element={<Protected><Settings /></Protected>} />
              <Route path="/:username" element={<StreamerPage />} />
            </Routes>
          </>
        } />
      </Routes>
    </>
  );
}
