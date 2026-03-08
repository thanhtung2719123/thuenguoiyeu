import { MapPin, ChevronRight, Filter } from 'lucide-react';
import './PartnerSchedule.css';

const MOCK_SCHEDULE = [
    {
        id: 'S001',
        title: 'Movie Partner - CGV Vincom',
        user: 'Anh Tuan',
        date: '12 Mar 2026',
        time: '18:00 - 21:00',
        location: 'Vincom Center, Dist 1',
        status: 'Confirmed'
    },
    {
        id: 'S002',
        title: 'Wedding Plus-one',
        user: 'Hoang Nam',
        date: '15 Mar 2026',
        time: '11:00 - 15:00',
        location: 'GEM Center, Dist 1',
        status: 'Pending'
    }
];

const PartnerSchedule = () => {
    return (
        <div className="partner-schedule-page">
            <div className="schedule-padding">
                <header className="schedule-header">
                    <h1 className="page-title">My Schedule</h1>
                    <button className="icon-btn-outline"><Filter size={20} /></button>
                </header>

                {/* Calendar Strip (Simplified) */}
                <div className="calendar-strip card">
                    {[10, 11, 12, 13, 14, 15, 16].map((day) => (
                        <div key={day} className={`day-item ${day === 12 ? 'active' : ''}`}>
                            <div className="day-name">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][day % 7]}</div>
                            <div className="day-number">{day}</div>
                        </div>
                    ))}
                </div>

                <div className="schedule-timeline">
                    <h2 className="section-title">Thursday, Mar 12</h2>

                    <div className="timeline-list">
                        {MOCK_SCHEDULE.map(item => (
                            <div key={item.id} className="timeline-card card">
                                <div className="timeline-status-pin" data-status={item.status.toLowerCase()} />
                                <div className="timeline-main">
                                    <div className="timeline-header">
                                        <span className="timeline-time">{item.time}</span>
                                        <span className={`status-pill ${item.status.toLowerCase()}`}>{item.status}</span>
                                    </div>
                                    <h3 className="timeline-title">{item.title}</h3>
                                    <div className="timeline-user">With {item.user}</div>

                                    <div className="timeline-details">
                                        <div className="detail-item">
                                            <MapPin size={14} />
                                            {item.location}
                                        </div>
                                    </div>
                                </div>
                                <ChevronRight size={18} className="text-subtle" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Availability Section */}
                <section className="availability-section">
                    <h2 className="section-title">Availability Settings</h2>
                    <div className="availability-card card">
                        <div className="setting-row">
                            <div className="setting-info">
                                <div className="setting-label">Weekday Earnings</div>
                                <div className="setting-desc">Set your base rate for Mon-Fri</div>
                            </div>
                            <div className="setting-value">$30/hr</div>
                        </div>
                        <div className="setting-row">
                            <div className="setting-info">
                                <div className="setting-label">Weekend Surcharge</div>
                                <div className="setting-desc">+20% applied to weekend bookings</div>
                            </div>
                            <div className="setting-toggle active" />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default PartnerSchedule;
