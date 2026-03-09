import { useState, useEffect } from 'react';
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
    Settings,
    Loader2,
    Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import ImageUpload from '../components/ImageUpload';
import './PartnerDashboard.css';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const PartnerDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [isOnline, setIsOnline] = useState(false);
    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState<any[]>([]);
    const [upcoming, setUpcoming] = useState<any[]>([]);
    const [stats, setStats] = useState({ earnings: 0, totalBookings: 0, rating: 0 });
    const [partnerName, setPartnerName] = useState('');
    const [gallery, setGallery] = useState<string[]>([]);

    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch partner profile & status
                const { data: partnerData, error: partnerError } = await supabase
                    .from('partners')
                    .select('is_online, rating, gallery, profiles(display_name)')
                    .eq('id', user.uid)
                    .single();

                if (partnerData) {
                    setIsOnline(partnerData.is_online || false);
                    setStats(prev => ({ ...prev, rating: partnerData.rating || 0 }));
                    setPartnerName((partnerData.profiles as any)?.display_name || 'Đối tác');
                    setGallery(partnerData.gallery || []);
                }

                if (partnerError && partnerError.code !== 'PGRST116') {
                    console.error('Error fetching partner data:', partnerError);
                }

                // Fetch Bookings (Pending & Confirmed)
                const { data: bookingsData, error: bookingsError } = await supabase
                    .from('bookings')
                    .select('*, profiles!renter_id(display_name, avatar_url, location)')
                    .eq('partner_id', user.uid)
                    .order('event_date', { ascending: true })
                    .order('start_time', { ascending: true });

                if (bookingsError) {
                    console.error('Error fetching bookings:', bookingsError);
                } else if (bookingsData) {
                    const pending = bookingsData.filter(b => b.status === 'pending');
                    const confirmed = bookingsData.filter(b => b.status === 'confirmed');
                    const completed = bookingsData.filter(b => b.status === 'completed');

                    setRequests(pending);
                    setUpcoming(confirmed);

                    const totalEarnings = completed.reduce((sum, b) => sum + (b.total_price || 0), 0);
                    setStats(prev => ({
                        ...prev,
                        earnings: totalEarnings,
                        totalBookings: completed.length + confirmed.length
                    }));
                }
            } catch (error) {
                console.error('Dashboard data fetch error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const toggleOnlineStatus = async () => {
        if (!user) return;
        const newStatus = !isOnline;
        setIsOnline(nextStatus => !nextStatus); // Temporary UI feedback

        const { error } = await supabase
            .from('partners')
            .update({ is_online: newStatus })
            .eq('id', user.uid);

        if (error) {
            setIsOnline(prev => !prev); // Revert UI
            console.error('Error updating status', error);
        }
    };

    const handleUpdateBookingStatus = async (bookingId: string, newStatus: string) => {
        try {
            const { error } = await supabase
                .from('bookings')
                .update({ status: newStatus })
                .eq('id', bookingId);

            if (error) throw error;

            // Remove from requests if handled
            setRequests(prev => prev.filter(req => req.id !== bookingId));

            // Move to upcoming if accepted
            if (newStatus === 'confirmed') {
                const acceptedBooking = requests.find(req => req.id === bookingId);
                if (acceptedBooking) {
                    setUpcoming(prev => [...prev, { ...acceptedBooking, status: 'confirmed' }]);
                }
            }
        } catch (error) {
            console.error('Error updating booking status', error);
            alert('Có lỗi xảy ra khi cập nhật.');
        }
    };

    const handleAddGalleryImage = async (url: string) => {
        if (!user) return;
        try {
            const newGallery = [...gallery, url];
            const { error } = await supabase
                .from('partners')
                .update({ gallery: newGallery })
                .eq('id', user.uid);

            if (error) throw error;
            setGallery(newGallery);
        } catch (error) {
            console.error('Error adding gallery image', error);
            alert('Có lỗi khi lưu ảnh.');
        }
    };

    const handleRemoveGalleryImage = async (indexToRemove: number) => {
        if (!user) return;
        try {
            const newGallery = gallery.filter((_, idx) => idx !== indexToRemove);
            const { error } = await supabase
                .from('partners')
                .update({ gallery: newGallery })
                .eq('id', user.uid);

            if (error) throw error;
            setGallery(newGallery);
        } catch (error) {
            console.error('Error removing gallery image', error);
            alert('Có lỗi khi xóa ảnh.');
        }
    };

    if (loading) {
        return (
            <div className="partner-dashboard">
                <div className="dashboard-padding flex-center" style={{ height: '50vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Loader2 className="spinner" size={32} />
                </div>
            </div>
        );
    }

    return (
        <div className="partner-dashboard">
            <div className="dashboard-padding">
                <header className="dashboard-header">
                    <div className="header-left">
                        <h1 className="page-title">Bảng điều khiển</h1>
                        <p className="text-subtle">Chào mừng trở lại, {partnerName}!</p>
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
                                onClick={toggleOnlineStatus}
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
                        <div className="stat-value">{formatCurrency(stats.earnings)}</div>
                        <div className="stat-label">Doanh thu</div>
                    </div>
                    <div className="stat-card card glass">
                        <div className="stat-icon-bg blue"><Users size={20} /></div>
                        <div className="stat-value">{stats.totalBookings}</div>
                        <div className="stat-label">Tổng lượt đặt</div>
                    </div>
                    <div className="stat-card card glass">
                        <div className="stat-icon-bg purple"><TrendingUp size={20} /></div>
                        <div className="stat-value">{stats.rating.toFixed(1)}</div>
                        <div className="stat-label">Đánh giá</div>
                    </div>
                </div>

                {/* Incoming Requests */}
                <section className="dashboard-section">
                    <div className="section-header-row">
                        <h2 className="section-title">Lời mời mới</h2>
                        {requests.length > 0 && <Bell size={20} className="pink-text" />}
                    </div>

                    {requests.length === 0 ? (
                        <div className="empty-state text-subtle">Không có lời mời nào mới.</div>
                    ) : (
                        <div className="requests-list">
                            {requests.map(req => (
                                <div key={req.id} className="request-card card glass">
                                    <div className="request-user">
                                        <img src={(req.profiles as any)?.avatar_url || 'https://via.placeholder.com/150'} alt={(req.profiles as any)?.display_name} className="request-avatar" />
                                        <div className="request-main-info">
                                            <h3 className="request-user-name">{(req.profiles as any)?.display_name || 'Khách hàng'}</h3>
                                            <div className="request-purpose pink-text">Yêu cầu dịch vụ</div>
                                        </div>
                                        <div className="request-price">{formatCurrency(req.total_price)}</div>
                                    </div>

                                    <div className="request-details">
                                        <div className="detail-item">
                                            <Clock size={14} />
                                            {req.event_date} {req.start_time} ({req.duration_hours} giờ)
                                        </div>
                                        <div className="detail-item">
                                            <MapPin size={14} />
                                            {(req.profiles as any)?.location || 'Chưa cập nhật'}
                                        </div>
                                    </div>

                                    <div className="request-actions">
                                        <button className="btn btn-outline flex-1 decline-btn" onClick={() => handleUpdateBookingStatus(req.id, 'cancelled')}>
                                            <X size={18} />
                                            Từ chối
                                        </button>
                                        <button className="btn btn-primary flex-1 accept-btn" onClick={() => handleUpdateBookingStatus(req.id, 'confirmed')}>
                                            <Check size={18} />
                                            Chấp nhận
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <section className="dashboard-section">
                    <h2 className="section-title">Lịch trình sắp tới</h2>
                    {upcoming.length === 0 ? (
                        <div className="empty-state text-subtle">Chưa có lịch trình sắp tới.</div>
                    ) : (
                        <div className="schedule-list card glass">
                            {upcoming.map(item => {
                                const eventDate = new Date(item.event_date);
                                const day = eventDate.getDate();
                                const monthNames = ["Th1", "Th2", "Th3", "Th4", "Th5", "Th6", "Th7", "Th8", "Th9", "Th10", "Th11", "Th12"];
                                const month = monthNames[eventDate.getMonth()];
                                return (
                                    <div key={item.id} className="schedule-item">
                                        <div className="schedule-date">
                                            <div className="day">{day}</div>
                                            <div className="month">{month}</div>
                                        </div>
                                        <div className="schedule-info">
                                            <div className="schedule-title">Gặp {(item.profiles as any)?.display_name || 'Khách'}</div>
                                            <div className="schedule-time text-subtle">{item.start_time} ({item.duration_hours} giờ)</div>
                                        </div>
                                        <ChevronRight size={18} className="text-subtle" />
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>

                {/* Instant Gallery Upload */}
                <section className="dashboard-section">
                    <div className="section-header-row">
                        <h2 className="section-title">Bộ sưu tập ảnh ({gallery.length}/15)</h2>
                    </div>

                    <div className="dashboard-gallery-grid">
                        {gallery.map((imgUrl, idx) => (
                            <div key={idx} className="dashboard-gallery-item">
                                <img src={imgUrl} alt={`Gallery ${idx}`} />
                                <button
                                    className="remove-gallery-btn card glass"
                                    onClick={() => handleRemoveGalleryImage(idx)}
                                >
                                    <Trash2 size={16} className="pink-text" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {gallery.length < 15 && (
                        <div className="gallery-upload-wrapper mt-4">
                            <ImageUpload
                                bucket="galleries"
                                onUploadSuccess={handleAddGalleryImage}
                                label="Thêm ảnh mới vào bộ sưu tập"
                            />
                        </div>
                    )}
                </section>

                <div className="bottom-spacing" />
            </div>
        </div>
    );
};

export default PartnerDashboard;

