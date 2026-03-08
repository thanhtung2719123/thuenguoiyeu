import { Star, MapPin, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './ProfileCard.css';

interface ProfileCardProps {
    id: number;
    name: string;
    age: number;
    rating: number;
    reviews: number;
    distance: string;
    price: number;
    imageUrl: string;
    isVerified: boolean;
    tags: string[];
}

const ProfileCard = ({
    id,
    name,
    age,
    rating,
    reviews,
    distance,
    price,
    imageUrl,
    isVerified,
    tags,
}: ProfileCardProps) => {
    const navigate = useNavigate();

    return (
        <div className="profile-card" onClick={() => navigate(`/partner/${id}`)}>
            <div className="profile-image-wrapper">
                <img src={imageUrl} alt={name} className="profile-image" />
                <div className="price-badge glass">
                    <span className="price-amount">${price}</span>
                    <span className="price-unit">/hr</span>
                </div>
                <button className="favorite-btn glass">
                    <Star size={18} />
                </button>
            </div>

            <div className="profile-info">
                <div className="profile-header">
                    <h3 className="profile-name">
                        {name}, {age}
                        {isVerified && <CheckCircle size={16} className="verified-icon" />}
                    </h3>
                    <div className="rating-pill">
                        <Star size={12} fill="currentColor" />
                        <span className="rating-score">{rating.toFixed(1)}</span>
                        <span className="rating-count">({reviews})</span>
                    </div>
                </div>

                <div className="profile-location text-subtle">
                    <MapPin size={14} />
                    {distance} away
                </div>

                <div className="profile-tags">
                    {tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="tag-pill">
                            {tag}
                        </span>
                    ))}
                    {tags.length > 3 && (
                        <span className="tag-pill tag-more">+{tags.length - 3}</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;
