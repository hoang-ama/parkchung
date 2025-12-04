import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HostRegisterPage from './pages/HostRegisterPage';
import HostDashboardPage from './pages/HostDashboardPage';
import HostCreateSpotPage from './pages/HostCreateSpotPage';
import HostLoginPage from './pages/HostLoginPage';
import HostSpotsPage from './pages/HostSpotsPage';
import HostBookingsPage from './pages/HostBookingsPage';

import HostLayout from './components/HostLayout';

function HostEarningsPage() {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Payouts & Earnings</h1>
                <p className="text-gray-600">Earnings dashboard coming soon...</p>
            </div>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Host Authentication Routes */}
                <Route path="/host/register" element={<HostRegisterPage />} />
                <Route path="/host/login" element={<HostLoginPage />} />

                {/* Protected Host Portal Routes */}
                <Route element={<HostLayout />}>
                    <Route path="/host/dashboard" element={<HostDashboardPage />} />
                    <Route path="/host/spots" element={<HostSpotsPage />} />
                    <Route path="/host/spots/new" element={<HostCreateSpotPage />} />
                    <Route path="/host/bookings" element={<HostBookingsPage />} />
                    <Route path="/host/earnings" element={<HostEarningsPage />} />
                </Route>

                {/* Redirect root to host dashboard for demo */}
                <Route path="/" element={<Navigate to="/host/dashboard" replace />} />

                {/* 404 fallback */}
                <Route
                    path="*"
                    element={
                        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                            <div className="text-center">
                                <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                                <p className="text-gray-600">Page not found</p>
                            </div>
                        </div>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
