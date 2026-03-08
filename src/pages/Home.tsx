import SearchBar from '../components/SearchBar';
import CategoryPills from '../components/CategoryPills';
import ProfileCard from '../components/ProfileCard';
import './Home.css';

const MOCK_PARTNERS = [
    {
        id: 1,
        name: 'Linh Nguyen',
        age: 24,
        rating: 4.9,
        reviews: 128,
        distance: '2.4 km',
        price: 35,
        imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
        isVerified: true,
        tags: ['Cafe Buddy', 'Fluent English', 'Photography'],
    },
    {
        id: 2,
        name: 'Minh Tran',
        age: 26,
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

const Home = () => {
    return (
        <div className="home-page">
            <div className="home-padding">
                <SearchBar />
            </div>

            <CategoryPills />

            <div className="home-padding">
                <div className="section-header">
                    <h2 className="section-title">Trending Near You</h2>
                </div>

                <div className="profiles-grid">
                    {MOCK_PARTNERS.map(partner => (
                        <ProfileCard key={partner.id} {...partner} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
