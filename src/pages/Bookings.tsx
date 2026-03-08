import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Clock, CheckCircle, Hourglass, CreditCard, ChevronRight, Info, LogIn, XCircle } from 'lucide-react';
import './Bookings.css';

const Bookings = () => {
    const { user, signInWithGoogle } = useAuth();
    const [activeTab, setActiveTab] = useState('Sắp tới');
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchBookings = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('bookings')
                    .select(`
                        *,
                        partners (
                            profiles (
                                id,
                                display_name,
                                avatar_url
                            )
                        ),
                        profiles!renter_id (
                            id,
                            display_name,
                            avatar_url
                        )
                    `)
                    .or(`renter_id.eq.${user.uid},partner_id.eq.${user.uid}`)
                    .order('created_at', { ascending: false });

                if (error) throw error;

                if (data) {
                    const formatted = data.map(b => {
                        const isRenter = b.renter_id === user.uid;
                        const otherParty = isRenter ? b.partners?.profiles : b.profiles;
                        return {
                            id: b.id.substring(0, 8).toUpperCase(),
                            partnerName: otherParty?.display_name || 'Người dùng ẩn danh',
                            partnerImage: otherParty?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
                            date: new Date(b.event_date).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' }),
                            time: b.start_time,
                            duration: `${b.duration_hours} giờ`,
                            status: b.status,
                            paymentStatus: b.escrow_status,
                            total: b.total_price,
                        };
                    });
                    setBookings(formatted);
                }
            } catch (err) {
                console.error('Error fetching bookings:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [user]);

    const filteredBookings = bookings.filter(b => {
        if (activeTab === 'Sắp tới') return ['pending', 'confirmed'].includes(b.status);
        if (activeTab === 'Gần đây') return b.status === 'completed';
        if (activeTab === 'Đã hủy') return b.status === 'cancelled';
        return true;
    });

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
                    {loading ? (
                        <div className="loading-state">
                            <p className="text-subtle">Đang tải danh sách...</p>
                        </div>
                    ) : filteredBookings.length > 0 ? (
                        filteredBookings.map(booking => (
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
                                        <div className={`status-pill ${booking.status}`}>
                                            {booking.status === 'confirmed' && <CheckCircle size={12} />}
                                            {booking.status === 'pending' && <Hourglass size={12} />}
                                            {booking.status === 'cancelled' && <XCircle size={12} />}
                                            {booking.status === 'confirmed' ? 'Đã xác nhận' :
                                                booking.status === 'pending' ? 'Đang chờ' :
                                                    booking.status === 'cancelled' ? 'Đã hủy' : 'Hoàn thành'}
                                        </div>
                                    </div>
                                    <div className="status-item">
                                        <div className="status-label text-subtle">Thanh toán (Escrow)</div>
                                        <div className="payment-status">
                                            <CreditCard size={12} />
                                            {booking.paymentStatus === 'hold' ? 'Tạm giữ' :
                                                booking.paymentStatus === 'released' ? 'Đã giải ngân' : 'Đang chờ'}
                                        </div>
                                    </div>
                                </div>

                                <div className="booking-footer">
                                    <div className="total-label">Tổng cộng: <span className="total-amount">{Number(booking.total).toLocaleString('vi-VN')}₫</span></div>
                                    <button className="btn btn-outline btn-sm details-btn">
                                        Xem chi tiết
                                        <ChevronRight size={16} />
                                    </button>
                                </div>

                                {booking.status === 'confirmed' && (
                                    <div className="escrow-badge">
                                        <Info size={14} />
                                        Hệ thống Escrow an toàn. Tiền sẽ được chuyển sau 24h hoàn thành.
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="empty-state card glass">
                            <p className="text-subtle">Không có lịch đặt nào trong mục này.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Bookings;
