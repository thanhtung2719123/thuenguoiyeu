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
        name: 'Linh Nguyen',
        age: 24,
        rating: 4.9,
        reviews: [
            { id: 101, user: 'Anh Tuan', rating: 5, comment: 'Linh was a fantastic cafe buddy! Very polite and great at photography.', date: '2 days ago' },
            { id: 102, user: 'Minh Hieu', rating: 4, comment: 'Very professional, highly recommend for social events.', date: '1 week ago' }
        ],
        distance: '2.4 km',
        price: 35,
        imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
        isVerified: true,
        bio: "Hi! I'm Linh, a freelance photographer and lifestyle blogger. I love exploring hidden cafes in Hanoi and taking beautiful photos. I'm fluent in English and can help you navigate the best social spots in the city. Looking forward to meeting you!",
        skills: ['Cafe Buddy', 'Fluent English', 'Photography', 'Wedding Etiquette'],
        vibePhotos: [
            'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400',
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400'
        ]
    },
    {
        id: 2,
        name: 'Minh Tran',
        age: 26,
        rating: 4.8,
        reviews: [],
        distance: '3.1 km',
        price: 45,
        imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=800',
        isVerified: true,
        bio: "Professional guide and corporate event partner. I specialize in fine dining etiquette and local city tours.",
        skills: ['Local Guide', 'Fine Dining', 'Driving', 'Corporate Event'],
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
                        <div className="stat-label">Identity</div>
                        <div className="stat-value">Verified</div>
                    </div>
                    <div className="stat-card">
                        <MessageCircle size={20} className="stat-icon pink" />
                        <div className="stat-label">Response</div>
                        <div className="stat-value">&lt; 1 hour</div>
                    </div>
                    <div className="stat-card">
                        <Calendar size={20} className="stat-icon pink" />
                        <div className="stat-label">Availability</div>
                        <div className="stat-value">Today</div>
                    </div>
                </div>

                {/* Bio Section */}
                <section className="profile-section">
                    <h2 className="section-title">About Me</h2>
                    <p className="bio-text">{partner.bio}</p>
                </section>

                {/* Skills Section */}
                <section className="profile-section">
                    <h2 className="section-title">Specialized Skills</h2>
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
                        <h2 className="section-title">Vibe Gallery</h2>
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
                        <h2 className="section-title">Reviews</h2>
                        <button className="btn-ghost pink-text">See all</button>
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
                            No reviews yet. Be the first to book!
                        </div>
                    )}
                </section>
            </div>

            {/* Sticky Booking Bar */}
            <div className="booking-bar glass">
                <div className="price-info">
                    <div className="price-amount-large">${partner.price}</div>
                    <div className="price-label text-subtle">per hour</div>
                </div>
                <button
                    className="btn btn-primary book-btn"
                    onClick={() => setIsBookingOpen(true)}
                >
                    Book Now
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
