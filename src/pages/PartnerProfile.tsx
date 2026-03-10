import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Star,
    MapPin,
    CheckCircle,
    ShieldCheck,
    MessageCircle,
    Calendar,
    Info,
    Loader2
} from 'lucide-react';
import BookingModal from '../components/BookingModal';
import { supabase } from '../lib/supabase';
import './PartnerProfile.css';

const PartnerProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [partner, setPartner] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isBookingOpen, setIsBookingOpen] = useState(false);

    useEffect(() => {
        const fetchPartner = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('partners')
                    .select('*, profiles(*)')
                    .eq('id', id)
                    .single();

                if (error) throw error;
                if (data) {
                    const formattedPartner = {
                        id: data.id,
                        name: data.profiles?.display_name || 'Người dùng ẩn danh',
                        age: data.profiles?.birthday ? new Date().getFullYear() - new Date(data.profiles.birthday).getFullYear() : 20,
                        rating: Number(data.rating) || 0,
                        reviews: [], // Reviews table not yet fully integrated for querying here
                        distance: data.profiles?.province || data.location || 'Hà Nội',
                        price: data.price_per_hour || 0,
                        imageUrl: data.profiles?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
                        isVerified: data.profiles?.is_verified || false,
                        bio: data.profiles?.bio || "Chưa có giới thiệu.",
                        skills: data.game_tags || [],
                        vibePhotos: data.gallery || []
                    };
                    setPartner(formattedPartner);
                }
            } catch (err) {
                console.error('Error fetching partner:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPartner();
    }, [id]);

    const handleConfirmBooking = () => {
        setIsBookingOpen(false);
        navigate('/bookings');
    };

    if (loading) {
        return (
            <div className="profile-page flex-center" style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Loader2 className="spinner" size={32} />
            </div>
        );
    }

    if (!partner) {
        return (
            <div className="profile-page flex-center" style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
                <p>Không tìm thấy thông tin đối tác.</p>
                <button className="btn btn-outline" onClick={() => navigate(-1)}>Quay lại</button>
            </div>
        );
    }

    return (
        <div className="profile-page">
            {/* Hero Header */}
            <div className="profile-hero">
                <img src={partner.imageUrl} alt={partner.name} className="hero-image" />
                <button className="back-btn glass" onClick={() => navigate(-1)}>
                    <ArrowLeft size={24} />
                </button>
                <div className="hero-overlay" />
            </div>

            <div className="profile-content-container">
                <div className="profile-header-main">
                    <div className="name-section">
                        <h1 className="profile-name-title">
                            {partner.name}, {partner.age}
                            {partner.isVerified && <CheckCircle size={20} className="verified-icon" />}
                        </h1>
                        <div className="location-info text-subtle">
                            <MapPin size={16} />
                            {partner.distance}
                        </div>
                    </div>
                    <div className="rating-box">
                        <div className="rating-value">
                            <Star size={16} fill="currentColor" />
                            {partner.rating.toFixed(1)}
                        </div>
                        <div className="review-count">{partner.reviews.length} reviews</div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="quick-stats">
                    <div className="stat-card">
                        <ShieldCheck size={20} className="stat-icon pink" />
                        <div className="stat-label">Danh tính</div>
                        <div className="stat-value">{partner.isVerified ? 'Đã xác minh' : 'Chưa xác minh'}</div>
                    </div>
                    <div className="stat-card">
                        <MessageCircle size={20} className="stat-icon pink" />
                        <div className="stat-label">Phản hồi</div>
                        <div className="stat-value">&lt; 1 giờ</div>
                    </div>
                    <div className="stat-card">
                        <Calendar size={20} className="stat-icon pink" />
                        <div className="stat-label">Trạng thái</div>
                        <div className="stat-value">Sẵn sàng</div>
                    </div>
                </div>

                {/* Bio Section */}
                <section className="profile-section">
                    <h2 className="section-title">Giới thiệu</h2>
                    <p className="bio-text">{partner.bio}</p>
                </section>

                {/* Skills Section */}
                <section className="profile-section">
                    <h2 className="section-title">Thẻ Game & Kỹ năng</h2>
                    <div className="skills-grid">
                        {partner.skills.length > 0 ? partner.skills.map((skill: string) => (
                            <div key={skill} className="skill-item card">
                                <CheckCircle size={14} className="pink" />
                                {skill}
                            </div>
                        )) : <p className="text-subtle">Chưa cập nhật thẻ game.</p>}
                    </div>
                </section>

                {/* Gallery Photos */}
                {partner.vibePhotos.length > 0 && (
                    <section className="profile-section">
                        <h2 className="section-title">Bộ sưu tập</h2>
                        <div className="vibe-gallery">
                            {partner.vibePhotos.map((url: string, idx: number) => (
                                <img key={idx} src={url} alt="gallery" className="vibe-img" />
                            ))}
                        </div>
                    </section>
                )}

                {/* Reviews Section */}
                <section className="profile-section reviews-section">
                    <div className="section-header-row">
                        <h2 className="section-title">Đánh giá</h2>
                        <button className="btn-ghost pink-text">Xem tất cả</button>
                    </div>
                    {partner.reviews.length > 0 ? (
                        <div className="reviews-list">
                            {partner.reviews.map((review: any) => (
                                <div key={review.id} className="review-card card">
                                    <div className="review-header">
                                        <span className="reviewer-name">{review.user}</span>
                                        <span className="review-date text-subtle">{review.date}</span>
                                    </div>
                                    <div className="review-rating">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={12} fill={i < review.rating ? 'currentColor' : 'none'} className="star-icon" />
                                        ))}
                                    </div>
                                    <p className="review-comment">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-reviews text-subtle">
                            <Info size={16} />
                            Chưa có đánh giá nào. Hãy là người đầu tiên đặt lịch!
                        </div>
                    )}
                </section>
            </div>

            {/* Sticky Booking Bar */}
            <div className="booking-bar glass">
                <div className="price-info">
                    <div className="price-amount-large">{partner.price.toLocaleString('vi-VN')}₫</div>
                    <div className="price-label text-subtle">mỗi giờ</div>
                </div>
                <button
                    className="btn btn-primary book-btn"
                    onClick={() => setIsBookingOpen(true)}
                >
                    Đặt ngay
                </button>
            </div>

            {isBookingOpen && (
                <BookingModal
                    partner={partner}
                    onClose={() => setIsBookingOpen(false)}
                    onConfirm={handleConfirmBooking}
                />
            )}
        </div>
    );
};

export default PartnerProfile;
