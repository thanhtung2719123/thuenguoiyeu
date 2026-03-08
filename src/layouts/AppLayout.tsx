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
        { path: '/', icon: Home, label: 'Khám phá' },
        { path: '/bookings', icon: CalendarClock, label: 'Lịch đặt' },
        { path: '/inbox', icon: MessageCircle, label: 'Tin nhắn' },
        { path: '/profile', icon: User, label: 'Cá nhân' },
    ];

    // Partner Navigation
    const partnerItems = [
        { path: '/partner-dashboard', icon: LayoutDashboard, label: 'Bảng điều khiển' },
        { path: '/partner-schedule', icon: CalendarClock, label: 'Lịch trình' },
        { path: '/partner-inbox', icon: MessageCircle, label: 'Tin nhắn' },
        { path: '/profile', icon: User, label: 'Tài khoản' },
    ];

    const navItems = isPartnerMode ? partnerItems : renterItems;

    return (
        <div className="app-container">
            {/* Desktop Sidebar */}
            <aside className="sidebar desktop-only glass">
                <div className="sidebar-header">
                    <h1 className="header-title">
                        {isPartnerMode ? (
                            <span className="gradient-text-alt">Đối tác</span>
                        ) : (
                            <span className="gradient-text">Thuê người yêu</span>
                        )}
                    </h1>
                </div>
                <nav className="sidebar-nav">
                    {navItems.map(({ path, icon: Icon, label }) => {
                        const isActive = location.pathname === path;
                        return (
                            <button
                                key={path}
                                className={`sidebar-btn ${isActive ? 'active' : ''}`}
                                onClick={() => navigate(path)}
                            >
                                <Icon size={20} />
                                <span>{label}</span>
                            </button>
                        );
                    })}
                </nav>
            </aside>

            <div className="main-wrapper">
                {/* Header Area (Mobile Only) */}
                <header className="app-header glass mobile-only">
                    <div className="header-content">
                        <h1 className="header-title">
                            {isPartnerMode ? (
                                <span className="gradient-text-alt">Trung tâm Đối tác</span>
                            ) : (
                                <span className="gradient-text">Thuê người yêu</span>
                            )}
                        </h1>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="app-main">
                    <Outlet />
                </main>
            </div>

            {/* Bottom Navigation (Mobile Only) */}
            <nav className="bottom-nav glass mobile-only">
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
