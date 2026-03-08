import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, CalendarClock, MessageCircle, User, LayoutDashboard } from 'lucide-react';
import { usePartner } from '../context/PartnerContext';
import './AppLayout.css';

const AppLayout = () => {
    const { isPartnerMode } = usePartner();
    const location = useLocation();
    const navigate = useNavigate();

    // Renter Navigation
    const renterItems = [
        { path: '/', icon: Home, label: 'Explore' },
        { path: '/bookings', icon: CalendarClock, label: 'Bookings' },
        { path: '/inbox', icon: MessageCircle, label: 'Inbox' },
        { path: '/profile', icon: User, label: 'Profile' },
    ];

    // Partner Navigation
    const partnerItems = [
        { path: '/partner-dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/partner-schedule', icon: CalendarClock, label: 'Schedule' },
        { path: '/partner-inbox', icon: MessageCircle, label: 'Messages' },
        { path: '/profile', icon: User, label: 'Account' },
    ];

    const navItems = isPartnerMode ? partnerItems : renterItems;

    return (
        <div className="app-container">
            {/* Header Area */}
            <header className="app-header glass">
                <div className="header-content">
                    <h1 className="header-title">
                        {isPartnerMode ? (
                            <span className="gradient-text-alt">Partner Hub</span>
                        ) : (
                            <span className="gradient-text">Rent-a-Date</span>
                        )}
                    </h1>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="app-main pb-nav">
                <Outlet />
            </main>

            {/* Bottom Navigation */}
            <nav className="bottom-nav glass">
                <div className="nav-items">
                    {navItems.map(({ path, icon: Icon, label }) => {
                        const isActive = location.pathname === path;
                        return (
                            <button
                                key={path}
                                className={`nav-btn ${isActive ? 'active' : ''}`}
                                onClick={() => navigate(path)}
                            >
                                <div className="icon-wrapper">
                                    <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                                    {isActive && <div className="active-dot" />}
                                </div>
                                <span className="nav-label">{label}</span>
                            </button>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
};

export default AppLayout;
