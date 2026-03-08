import { Filter, CalendarX } from 'lucide-react';
import './PartnerSchedule.css';

const PartnerSchedule = () => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' });

    return (
        <div className="partner-schedule-page">
            <div className="schedule-padding">
                <header className="schedule-header">
                    <h1 className="page-title">Lịch trình của tôi</h1>
                    <button className="icon-btn-outline"><Filter size={20} /></button>
                </header>

                {/* Calendar Strip (Simplified) */}
                <div className="calendar-strip card">
                    {[0, 1, 2, 3, 4, 5, 6].map((offset) => {
                        const date = new Date();
                        date.setDate(today.getDate() + offset - 2); // Show a range around today
                        const dayName = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][date.getDay()];
                        const isToday = offset === 2;
                        return (
                            <div key={offset} className={`day-item ${isToday ? 'active' : ''}`}>
                                <div className="day-name">{dayName}</div>
                                <div className="day-number">{date.getDate()}</div>
                            </div>
                        );
                    })}
                </div>

                <div className="schedule-timeline">
                    <h2 className="section-title">{formattedDate}</h2>

                    <div className="timeline-list">
                        <div className="empty-timeline card text-subtle">
                            <CalendarX size={32} strokeWidth={1.5} />
                            <p>Không có lịch trình nào cho ngày hôm nay.</p>
                        </div>
                    </div>
                </div>

                {/* Availability Section */}
                <section className="availability-section">
                    <h2 className="section-title">Cài đặt thời gian rảnh</h2>
                    <div className="availability-card card">
                        <div className="setting-row">
                            <div className="setting-info">
                                <div className="setting-label">Mức giá cơ bản</div>
                                <div className="setting-desc">Áp dụng cho mọi ngày trong tuần</div>
                            </div>
                            <div className="setting-value">0₫/giờ</div>
                        </div>
                        <div className="setting-row">
                            <div className="setting-info">
                                <div className="setting-label">Phụ phí cuối tuần</div>
                                <div className="setting-desc">Tự động tăng giá vào T7 & CN</div>
                            </div>
                            <div className="setting-toggle" />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default PartnerSchedule;
