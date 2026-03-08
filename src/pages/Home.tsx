import SearchBar from '../components/SearchBar';
import CategoryPills from '../components/CategoryPills';
import ProfileCard from '../components/ProfileCard';
import './Home.css';

const MOCK_PARTNERS = [
    {
        id: 1,
        name: 'Linh Nguyễn',
        age: 22,
        rating: 4.9,
        reviews: 128,
        distance: '1.5 km',
        price: 350000,
        imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800',
        isVerified: true,
        tags: ['Cà phê', 'Chụp ảnh', 'Tiếng Anh'],
    },
    {
        id: 2,
        name: 'Minh Hoàng',
        age: 24,
        rating: 4.8,
        reviews: 95,
        distance: '3.1 km',
        price: 450000,
        imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=800',
        isVerified: true,
        tags: ['Hướng dẫn viên', 'Ăn tối', 'Lái xe'],
    },
    {
        id: 3,
        name: 'Hoa Lê',
        age: 21,
        rating: 5.0,
        reviews: 42,
        distance: '1.2 km',
        price: 400000,
        imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800',
        isVerified: false,
        tags: ['Dự tiệc cưới', 'Karaoke', 'Cổ vũ'],
    },
    {
        id: 4,
        name: 'Tuấn Phạm',
        age: 28,
        rating: 4.7,
        reviews: 210,
        distance: '5.5 km',
        price: 300000,
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
        isVerified: true,
        tags: ['Gym Buddy', 'Mua sắm', 'Tiếng Nhật'],
    }
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
                    <SearchBar />
                </header>

                <section className="categories-section">
                    <div className="section-header">
                        <h2 className="section-title">Danh mục nhanh</h2>
                    </div>
                    <CategoryPills />
                </section>

                <section className="partners-section">
                    <div className="section-header">
                        <h2 className="section-title">Bạn cùng hành nổi bật</h2>
                        <button className="text-btn pink-text">Xem tất cả</button>
                    </div>
                    <div className="partners-grid">
                        {MOCK_PARTNERS.map(partner => (
                            <ProfileCard key={partner.id} {...partner} />
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Home;
