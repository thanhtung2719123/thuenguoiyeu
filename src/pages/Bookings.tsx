import { useAuth } from '../context/AuthContext';
import { Clock, CheckCircle, Hourglass, CreditCard, ChevronRight, Info, LogIn } from 'lucide-react';
import './Bookings.css';

const MOCK_BOOKINGS = [
    {
        id: 'B001',
        partnerName: 'Linh Nguyễn',
        partnerImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
        date: '10 Tháng 3, 2026',
        time: '19:00',
        duration: '2 giờ',
        status: 'Confirmed',
        paymentStatus: 'Escrow (Hold)',
        total: 750000,
    },
    {
        id: 'B002',
        partnerName: 'Minh Trần',
        partnerImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=800',
        date: '12 Tháng 3, 2026',
        time: '14:00',
        duration: '3 giờ',
        status: 'Pending',
        paymentStatus: 'Awaiting Acceptance',
        total: 1400000,
    }
];

const Bookings = () => {
    const { user, signInWithGoogle } = useAuth();
    const [activeTab, setActiveTab] = useState('Sắp tới');

    if (!user) {
        return (
            <div className="bookings-page">
                <div className="bookings-padding">
                    <h1 className="page-title">Lịch đặt</h1>
                    <div className="card glass auth-prompt-card">
                        <div className="auth-icon-bg">
                            <LogIn size={48} className="pink-text" />
                        </div>
                        <h2>Bạn chưa đăng nhập</h2>
                        <p className="text-subtle">Vui lòng đăng nhập để theo dõi các đơn đặt của bạn.</p>
                        <button className="btn btn-primary w-full" onClick={signInWithGoogle}>
                            Đăng nhập với Google
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bookings-page">
            <div className="bookings-padding">
                <h1 className="page-title">Lịch đặt của tôi</h1>

                <div className="tabs-container card glass">
                    {['Sắp tới', 'Gần đây', 'Đã hủy'].map(tab => (
                        <button
                            key={tab}
                            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="bookings-list">
                    {MOCK_BOOKINGS.filter(b => activeTab === 'Sắp tới' ? b.status !== 'Cancelled' : true).map(booking => (
                        <div key={booking.id} className="booking-card card">
                            <div className="booking-main">
                                <img src={booking.partnerImage} alt={booking.partnerName} className="booking-avatar" />
                                <div className="booking-info">
                                    <div className="booking-header-row">
                                        <h3 className="booking-partner-name">{booking.partnerName}</h3>
                                        <div className="booking-id">#{booking.id}</div>
                                    </div>
                                    <div className="booking-time-row text-subtle">
                                        <Clock size={14} />
                                        {booking.date} lúc {booking.time} ({booking.duration})
                                    </div>
                                </div>
                            </div>

                            <div className="booking-divider" />

                            <div className="status-row">
                                <div className="status-item">
                                    <div className="status-label text-subtle">Trạng thái</div>
                                    <div className={`status-pill ${booking.status.toLowerCase()}`}>
                                        {booking.status === 'Confirmed' ? <CheckCircle size={12} /> : <Hourglass size={12} />}
                                        {booking.status === 'Confirmed' ? 'Đã xác nhận' : 'Đang chờ'}
                                    </div>
                                </div>
                                <div className="status-item">
                                    <div className="status-label text-subtle">Thanh toán (Escrow)</div>
                                    <div className="payment-status">
                                        <CreditCard size={12} />
                                        {booking.paymentStatus === 'Escrow (Hold)' ? 'Tạm giữ' : 'Đang chờ chấp nhận'}
                                    </div>
                                </div>
                            </div>

                            <div className="booking-footer">
                                <div className="total-label">Tổng cộng: <span className="total-amount">{booking.total.toLocaleString('vi-VN')}₫</span></div>
                                <button className="btn btn-outline btn-sm details-btn">
                                    Xem chi tiết
                                    <ChevronRight size={16} />
                                </button>
                            </div>

                            {booking.status === 'Confirmed' && (
                                <div className="escrow-badge">
                                    <Info size={14} />
                                    Hệ thống Escrow an toàn. Tiền sẽ được chuyển sau 24h hoàn thành.
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Bookings;
