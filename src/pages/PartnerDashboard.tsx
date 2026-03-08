import { useState } from 'react';
import {
    TrendingUp,
    Users,
    DollarSign,
    Clock,
    Bell,
    Settings,
    Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './PartnerDashboard.css';

const PartnerDashboard = () => {
    const { user } = useAuth();
    const [isOnline, setIsOnline] = useState(true);
    const navigate = useNavigate();

    return (
        <div className="partner-dashboard">
            <div className="dashboard-padding">
                <header className="dashboard-header">
                    <div className="header-left">
                        <h1 className="page-title">Bảng điều khiển Đối tác</h1>
                        <p className="text-subtle">Chào mừng trở lại, {user?.displayName || 'bạn'}!</p>
                    </div>
                    <div className="header-actions">
                        <button
                            className="icon-btn-outline"
                            onClick={() => navigate('/partner-profile-edit')}
                        >
                            <Settings size={20} />
                        </button>
                        <div className="status-toggle-container">
                            <span className={`status-text ${isOnline ? 'online' : 'offline'}`}>
                                {isOnline ? 'Đang hoạt động' : 'Ngoại tuyến'}
                            </span>
                            <button
                                className={`toggle-switch ${isOnline ? 'on' : 'off'}`}
                                onClick={() => setIsOnline(!isOnline)}
                            >
                                <div className="toggle-handle" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="stats-grid">
                    <div className="stat-card card glass">
                        <div className="stat-icon-bg green"><DollarSign size={20} /></div>
                        <div className="stat-value">0₫</div>
                        <div className="stat-label">Tuần này</div>
                    </div>
                    <div className="stat-card card glass">
                        <div className="stat-icon-bg blue"><Users size={20} /></div>
                        <div className="stat-value">0</div>
                        <div className="stat-label">Tổng lượt đặt</div>
                    </div>
                    <div className="stat-card card glass">
                        <div className="stat-icon-bg purple"><TrendingUp size={20} /></div>
                        <div className="stat-value">0.0</div>
                        <div className="stat-label">Đánh giá</div>
                    </div>
                </div>

                {/* Incoming Requests */}
                <section className="dashboard-section">
                    <div className="section-header-row">
                        <h2 className="section-title">Lời mời mới</h2>
                        <Bell size={20} className="pink-text" />
                    </div>

                    <div className="requests-list">
                        <div className="empty-state-card card">
                            <div className="empty-icon-wrapper">
                                <Info size={24} className="text-subtle" />
                            </div>
                            <p className="empty-text">Chưa có lời mời mới nào.</p>
                            <p className="empty-subtext">Hoàn thiện hồ sơ để thu hút khách hàng hơn!</p>
                        </div>
                    </div>
                </section>

                {/* Upcoming Schedule */}
                <section className="dashboard-section">
                    <div className="section-header-row">
                        <h2 className="section-title">Lịch trình sắp tới</h2>
                        <button className="btn-ghost pink-text font-medium" onClick={() => navigate('/partner-schedule')}>
                            Xem tất cả
                        </button>
                    </div>
                    <div className="schedule-list card">
                        <div className="empty-schedule text-subtle">
                            <Clock size={20} />
                            <span>Bạn chưa có lịch trình nào sắp tới.</span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default PartnerDashboard;
