import { useState } from 'react';
import {
    TrendingUp,
    Users,
    DollarSign,
    Clock,
    Bell,
    MapPin,
    Check,
    X,
    ChevronRight,
    Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './PartnerDashboard.css';

const MOCK_REQUESTS = [
    {
        id: 'R001',
        userName: 'Anh Tuấn',
        userImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
        purpose: 'Bạn cà phê / Chụp ảnh',
        location: 'Cộng Cà Phê, Hồ Tây',
        time: 'Hôm nay, 19:30',
        duration: '2 giờ',
        earnings: '700.000₫',
    }
];

const PartnerDashboard = () => {
    const [isOnline, setIsOnline] = useState(true);
    const navigate = useNavigate();

    return (
        <div className="partner-dashboard">
            <div className="dashboard-padding">
                <header className="dashboard-header">
                    <div className="header-left">
                        <h1 className="page-title">Bảng điều khiển Đối tác</h1>
                        <p className="text-subtle">Chào mừng trở lại, Linh!</p>
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
                        <div className="stat-value">4.200.000₫</div>
                        <div className="stat-label">Tuần này</div>
                    </div>
                    <div className="stat-card card glass">
                        <div className="stat-icon-bg blue"><Users size={20} /></div>
                        <div className="stat-value">12</div>
                        <div className="stat-label">Tổng lượt đặt</div>
                    </div>
                    <div className="stat-card card glass">
                        <div className="stat-icon-bg purple"><TrendingUp size={20} /></div>
                        <div className="stat-value">4.9</div>
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
                        {MOCK_REQUESTS.map(req => (
                            <div key={req.id} className="request-card card">
                                <div className="request-user">
                                    <img src={req.userImage} alt={req.userName} className="request-avatar" />
                                    <div className="request-main-info">
                                        <h3 className="request-user-name">{req.userName}</h3>
                                        <div className="request-purpose pink-text">{req.purpose}</div>
                                    </div>
                                    <div className="request-price">{req.earnings}</div>
                                </div>

                                <div className="request-details">
                                    <div className="detail-item">
                                        <Clock size={14} />
                                        {req.time} ({req.duration})
                                    </div>
                                    <div className="detail-item">
                                        <MapPin size={14} />
                                        {req.location}
                                    </div>
                                </div>

                                <div className="request-actions">
                                    <button className="btn btn-outline flex-1 decline-btn">
                                        <X size={18} />
                                        Từ chối
                                    </button>
                                    <button className="btn btn-primary flex-1 accept-btn">
                                        <Check size={18} />
                                        Chấp nhận
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Upcoming Schedule */}
                <section className="dashboard-section">
                    <h2 className="section-title">Lịch trình sắp tới</h2>
                    <div className="schedule-list card">
                        <div className="schedule-item">
                            <div className="schedule-date">
                                <div className="day">12</div>
                                <div className="month">Th3</div>
                            </div>
                            <div className="schedule-info">
                                <div className="schedule-title">Bạn xem phim (CGV Vincom)</div>
                                <div className="schedule-time text-subtle">18:00 - 21:00</div>
                            </div>
                            <ChevronRight size={18} className="text-subtle" />
                        </div>
                        <div className="schedule-item">
                            <div className="schedule-date">
                                <div className="day">15</div>
                                <div className="month">Th3</div>
                            </div>
                            <div className="schedule-info">
                                <div className="schedule-title">Đi tiệc đám cưới</div>
                                <div className="schedule-time text-subtle">11:00 - 15:00</div>
                            </div>
                            <ChevronRight size={18} className="text-subtle" />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default PartnerDashboard;
