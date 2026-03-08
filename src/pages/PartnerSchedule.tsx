import { MapPin, ChevronRight, Filter } from 'lucide-react';
import './PartnerSchedule.css';

const MOCK_SCHEDULE = [
    {
        id: 'S001',
        title: 'Xem phim cùng bạn - CGV Vincom',
        user: 'Anh Tuấn',
        date: '12 Tháng 3, 2026',
        time: '18:00 - 21:00',
        location: 'Vincom Center, Quận 1',
        status: 'Confirmed'
    },
    {
        id: 'S002',
        title: 'Đi tiệc đám cưới',
        user: 'Hoàng Nam',
        date: '15 Tháng 3, 2026',
        time: '11:00 - 15:00',
        location: 'GEM Center, Quận 1',
        status: 'Pending'
    }
];

const PartnerSchedule = () => {
    return (
        <div className="partner-schedule-page">
            <div className="schedule-padding">
                <header className="schedule-header">
                    <h1 className="page-title">Lịch trình của tôi</h1>
                    <button className="icon-btn-outline"><Filter size={20} /></button>
                </header>

                {/* Calendar Strip (Simplified) */}
                <div className="calendar-strip card">
                    {[10, 11, 12, 13, 14, 15, 16].map((day) => (
                        <div key={day} className={`day-item ${day === 12 ? 'active' : ''}`}>
                            <div className="day-name">{['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'][(day - 10) % 7]}</div>
                            <div className="day-number">{day}</div>
                        </div>
                    ))}
                </div>

                <div className="schedule-timeline">
                    <h2 className="section-title">Thứ Năm, 12 Tháng 3</h2>

                    <div className="timeline-list">
                        {MOCK_SCHEDULE.map(item => (
                            <div key={item.id} className="timeline-card card">
                                <div className="timeline-status-pin" data-status={item.status.toLowerCase()} />
                                <div className="timeline-main">
                                    <div className="timeline-header">
                                        <span className="timeline-time">{item.time}</span>
                                        <span className={`status-pill ${item.status.toLowerCase()}`}>
                                            {item.status === 'Confirmed' ? 'Đã xác nhận' : 'Đang chờ'}
                                        </span>
                                    </div>
                                    <h3 className="timeline-title">{item.title}</h3>
                                    <div className="timeline-user">Cùng với {item.user}</div>

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
                    <h2 className="section-title">Cài đặt thời gian rảnh</h2>
                    <div className="availability-card card">
                        <div className="setting-row">
                            <div className="setting-info">
                                <div className="setting-label">Thu nhập ngày thường</div>
                                <div className="setting-desc">Mức giá cơ bản của bạn (T2-T6)</div>
                            </div>
                            <div className="setting-value">300.000₫/giờ</div>
                        </div>
                        <div className="setting-row">
                            <div className="setting-info">
                                <div className="setting-label">Phụ phí cuối tuần</div>
                                <div className="setting-desc">Áp dụng +20% cho các ngày cuối tuần</div>
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
