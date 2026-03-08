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
    ChevronRight
} from 'lucide-react';
import './PartnerDashboard.css';

const MOCK_REQUESTS = [
    {
        id: 'R001',
        userName: 'Anh Tuan',
        userImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
        purpose: 'Cafe Buddy / Photography',
        location: 'Cong Caphe, West Lake',
        time: 'Today, 19:30',
        duration: '2 hours',
        earnings: '$70',
    }
];

const PartnerDashboard = () => {
    const [isOnline, setIsOnline] = useState(true);

    return (
        <div className="partner-dashboard">
            <div className="dashboard-padding">
                <header className="dashboard-header">
                    <div>
                        <h1 className="page-title">Partner Dashboard</h1>
                        <p className="text-subtle">Welcome back, Linh!</p>
                    </div>
                    <div className="status-toggle-container">
                        <span className={`status-text ${isOnline ? 'online' : 'offline'}`}>
                            {isOnline ? 'Active' : 'Offline'}
                        </span>
                        <button
                            className={`toggle-switch ${isOnline ? 'on' : 'off'}`}
                            onClick={() => setIsOnline(!isOnline)}
                        >
                            <div className="toggle-handle" />
                        </button>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="stats-grid">
                    <div className="stat-card card glass">
                        <div className="stat-icon-bg green"><DollarSign size={20} /></div>
                        <div className="stat-value">$420</div>
                        <div className="stat-label">This Week</div>
                    </div>
                    <div className="stat-card card glass">
                        <div className="stat-icon-bg blue"><Users size={20} /></div>
                        <div className="stat-value">12</div>
                        <div className="stat-label">Total Gigs</div>
                    </div>
                    <div className="stat-card card glass">
                        <div className="stat-icon-bg purple"><TrendingUp size={20} /></div>
                        <div className="stat-value">4.9</div>
                        <div className="stat-label">Rating</div>
                    </div>
                </div>

                {/* Incoming Requests */}
                <section className="dashboard-section">
                    <div className="section-header-row">
                        <h2 className="section-title">New Invitations</h2>
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
                                        Decline
                                    </button>
                                    <button className="btn btn-primary flex-1 accept-btn">
                                        <Check size={18} />
                                        Accept
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Upcoming Schedule */}
                <section className="dashboard-section">
                    <h2 className="section-title">Upcoming Schedule</h2>
                    <div className="schedule-list card">
                        <div className="schedule-item">
                            <div className="schedule-date">
                                <div className="day">12</div>
                                <div className="month">Mar</div>
                            </div>
                            <div className="schedule-info">
                                <div className="schedule-title">Movie Partner (CGV Vincom)</div>
                                <div className="schedule-time text-subtle">18:00 - 21:00</div>
                            </div>
                            <ChevronRight size={18} className="text-subtle" />
                        </div>
                        <div className="schedule-item">
                            <div className="schedule-date">
                                <div className="day">15</div>
                                <div className="month">Mar</div>
                            </div>
                            <div className="schedule-info">
                                <div className="schedule-title">Wedding Plus-one</div>
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
