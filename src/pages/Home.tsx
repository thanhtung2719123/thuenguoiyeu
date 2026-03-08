import { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import CategoryPills from '../components/CategoryPills';
import ProfileCard from '../components/ProfileCard';
import { supabase } from '../lib/supabase';
import './Home.css';

const Home = () => {
    const [partners, setPartners] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPartners = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('partners')
                    .select('*, profiles!partner_id(*)')
                    .eq('availability_status', 'available');

                if (error) throw error;

                if (data) {
                    const formattedPartners = data.map((p: any) => ({
                        id: p.id,
                        name: p.profiles?.display_name || 'Người dùng ẩn danh',
                        age: 20,
                        rating: Number(p.rating),
                        reviews: p.review_count,
                        distance: p.location || 'Hà Nội',
                        price: p.price_per_hour,
                        imageUrl: p.profiles?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
                        isVerified: true,
                        tags: p.skills || [],
                    }));
                    setPartners(formattedPartners);
                }
            } catch (err) {
                console.error('Error fetching partners:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPartners();
    }, []);

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

                    {loading ? (
                        <div className="loading-state">
                            <p className="text-subtle">Đang tải danh sách...</p>
                        </div>
                    ) : partners.length > 0 ? (
                        <div className="partners-grid">
                            {partners.map(partner => (
                                <ProfileCard key={partner.id} {...partner} />
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state card glass">
                            <p className="text-subtle">Chưa có ai online lúc này. Hãy quay lại sau nhé!</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Home;
