import SearchBar from '../components/SearchBar';
import CategoryPills from '../components/CategoryPills';
import ProfileCard from '../components/ProfileCard';
import './Home.css';
import { Search, MapPin, Star, Heart, Coffee, Compass, Music } from 'lucide-react'; // Assuming these icons are from lucide-react
import { Link } from 'react-router-dom'; // Assuming Link is from react-router-dom

const MOCK_PARTNERS = [
    {
        id: '1',
        name: 'Linh Nguyễn',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
        rating: 4.9,
        price: '350.000',
        location: 'Hà Nội',
        tags: ['Cà phê', 'Chụp ảnh', 'Tiếng Anh'],
    },
    {
        id: '2',
        name: 'Minh Hoàng',
        image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400',
        rating: 4.8,
        reviews: 95,
        distance: '3.1 km',
        price: 45,
        imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=800',
        isVerified: true,
        tags: ['Local Guide', 'Fine Dining', 'Driving'],
    },
    {
        id: 3,
        name: 'Hoa Le',
        age: 22,
        rating: 5.0,
        reviews: 42,
        distance: '1.2 km',
        price: 40,
        imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800',
        isVerified: false,
        tags: ['Wedding Plus-One', 'Karaoke', 'Party Hype'],
    },
    {
        id: 4,
        name: 'Tuan Pham',
        age: 28,
        rating: 4.7,
        reviews: 210,
        distance: '5.5 km',
        price: 30,
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
        isVerified: true,
        tags: ['Gym Buddy', 'Shopping', 'Fluent Japanese'],
    }
];

// Assuming CATEGORIES constant is defined elsewhere or needs to be added.
// For the purpose of this edit, I'll define a placeholder CATEGORIES array
// based on the structure implied by the new JSX.
const CATEGORIES = [
    { id: 1, name: 'Cafe Buddy', icon: '☕', color: 'bg-blue-200' },
    { id: 2, name: 'Local Guide', icon: '🗺️', color: 'bg-green-200' },
    { id: 3, name: 'Photography', icon: '📸', color: 'bg-purple-200' },
    { id: 4, name: 'Driving', icon: '🚗', color: 'bg-yellow-200' },
];


const Home = () => {
    return (
        <div className="home-page">
            <div className="home-padding">
                <header className="home-header">
                    <div className="welcome-text">
                        <h1 className="greeting">Khám phá</h1>
                        <p className="subtitle">Tìm người bạn đồng hành hoàn hảo</p>
                    </div>
                    <div className="search-bar card glass">
                        <Search size={20} className="text-subtle" />
                        <input type="text" placeholder="Tìm theo thành phố hoặc dịch vụ..." />
                    </div>
                </header>

                <section className="categories-section">
                    <div className="section-header">
                        <h2 className="section-title">Danh mục nhanh</h2>
                    </div>
                    <div className="categories-grid">
                        {CATEGORIES.map(cat => (
                            <div key={cat.id} className="category-card card glass">
                                <div className={`icon-bg ${cat.color}`}>{cat.icon}</div>
                                <span className="cat-name">{cat.name}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="partners-section">
                    <div className="section-header">
                        <h2 className="section-title">Bạn cùng hành nổi bật</h2>
                        <button className="text-btn pink-text">Xem tất cả</button>
                    </div>
                    <div className="partners-list">
                        {MOCK_PARTNERS.map(partner => (
                            <Link to={`/partner/${partner.id}`} key={partner.id} className="partner-card card glass">
                                <div className="partner-image-wrapper">
                                    <img src={partner.imageUrl} alt={partner.name} className="partner-image" />
                                    <div className="partner-rating">
                                        <Star size={12} fill="currentColor" />
                                        <span>{partner.rating}</span>
                                    </div>
                                </div>
                                <div className="partner-info">
                                    <div className="partner-main">
                                        <h3 className="partner-name">{partner.name}</h3>
                                        <div className="partner-price pink-text">{partner.price}₫/giờ</div>
                                    </div>
                                    <div className="partner-location">
                                        <MapPin size={12} />
                                        <span>{partner.distance}</span> {/* Using distance as location for now */}
                                    </div>
                                    <div className="partner-tags">
                                        {partner.tags.map(tag => (
                                            <span key={tag} className="tag-pill">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Home;
