import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Star,
    MapPin,
    CheckCircle,
    ShieldCheck,
    MessageCircle,
    Calendar,
    Info
} from 'lucide-react';
import BookingModal from '../components/BookingModal';
import './PartnerProfile.css';

const MOCK_PARTNERS = [
    {
        id: 1,
        name: 'Linh Nguyễn',
        age: 24,
        rating: 4.9,
        reviews: [
            { id: 101, user: 'Anh Tuấn', rating: 5, comment: 'Linh là một người bạn đi cà phê tuyệt vời! Rất lịch sự và chụp ảnh cực đẹp.', date: '2 ngày trước' },
            { id: 102, user: 'Minh Hiếu', rating: 4, comment: 'Rất chuyên nghiệp, rất nên đặt cho các sự kiện xã hội.', date: '1 tuần trước' }
        ],
        distance: '2.4 km',
        price: 350000,
        imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
        isVerified: true,
        bio: "Chào bạn! Mình là Linh, một nhiếp ảnh gia tự do và blogger phong cách sống. Mình yêu thích khám phá những quán cà phê ẩn mình ở Hà Nội và chụp những bức ảnh đẹp. Mình thông thạo tiếng Anh và có thể giúp bạn tìm những địa điểm thú vị nhất trong thành phố. Rất mong được gặp bạn!",
        skills: ['Bạn cà phê', 'Thông thạo tiếng Anh', 'Nhiếp ảnh', 'Nghi thức đám cưới'],
        vibePhotos: [
            'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400',
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400'
        ]
    },
    {
        id: 2,
        name: 'Minh Trần',
        age: 26,
        rating: 4.8,
        reviews: [],
        distance: '3.1 km',
        price: 450000,
        imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=800',
        isVerified: true,
        bio: "Hướng dẫn viên chuyên nghiệp và đối tác sự kiện doanh nghiệp. Mình chuyên về nghi thức ăn uống cao cấp và tham quan thành phố.",
        skills: ['Hướng dẫn địa phương', 'Ăn uống cao cấp', 'Lái xe', 'Sự kiện doanh nghiệp'],
        vibePhotos: []
    }
];

const PartnerProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const partner = MOCK_PARTNERS.find(p => p.id === Number(id)) || MOCK_PARTNERS[0];
    const [isBookingOpen, setIsBookingOpen] = useState(false);

    const handleConfirmBooking = () => {
        setIsBookingOpen(false);
        navigate('/bookings');
    };

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
                            {partner.distance} away • Hanoi, Vietnam
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
                        <div className="stat-value">Đã xác minh</div>
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
                    <h2 className="section-title">Kỹ năng chuyên môn</h2>
                    <div className="skills-grid">
                        {partner.skills.map(skill => (
                            <div key={skill} className="skill-item card">
                                <CheckCircle size={14} className="pink" />
                                {skill}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Vibe Photos */}
                {partner.vibePhotos.length > 0 && (
                    <section className="profile-section">
                        <h2 className="section-title">Bộ sưu tập</h2>
                        <div className="vibe-gallery">
                            {partner.vibePhotos.map((url, idx) => (
                                <img key={idx} src={url} alt="vibe" className="vibe-img" />
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
                            {partner.reviews.map(review => (
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
