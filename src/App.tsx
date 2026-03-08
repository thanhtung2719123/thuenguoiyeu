import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import Home from './pages/Home';
import PartnerProfile from './pages/PartnerProfile';
import Bookings from './pages/Bookings';
import Inbox from './pages/Inbox';
import Profile from './pages/Profile';
import PartnerDashboard from './pages/PartnerDashboard';
import PartnerSchedule from './pages/PartnerSchedule';
import EmptyPage from './pages/EmptyPage';

import { PartnerProvider } from './context/PartnerContext';

function App() {
  return (
    <BrowserRouter>
      <PartnerProvider>
        <Routes>
          <Route element={<AppLayout />}>
            {/* Main Tab Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/profile" element={<Profile />} />

            {/* Detailed Views */}
            <Route path="/partner/:id" element={<PartnerProfile />} />
            <Route path="/partner-dashboard" element={<PartnerDashboard />} />
            <Route path="/partner-schedule" element={<PartnerSchedule />} />
            <Route path="/partner-inbox" element={<EmptyPage title="Partner Messages" />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PartnerProvider>
    </BrowserRouter>
  );
}

export default App;
