import {
    HeartHandshake,
    Coffee,
    Map,
    Utensils,
    Camera,
    Music,
    ShoppingBag
} from 'lucide-react';
import './CategoryPills.css';

const categories = [
    { id: 'wedding', label: 'Dự tiệc cưới', icon: HeartHandshake, color: '#FF80AB' },
    { id: 'cafe', label: 'Cà phê', icon: Coffee, color: '#A78BFA' },
    { id: 'tour', label: 'Hướng dẫn viên', icon: Map, color: '#34D399' },
    { id: 'dinner', label: 'Ăn tối', icon: Utensils, color: '#FBBF24' },
    { id: 'photo', label: 'Chụp ảnh', icon: Camera, color: '#60A5FA' },
    { id: 'karaoke', label: 'Karaoke', icon: Music, color: '#F472B6' },
    { id: 'shopping', label: 'Mua sắm', icon: ShoppingBag, color: '#FB923C' },
];

const CategoryPills = () => {
    return (
        <div className="category-section">
            <div className="section-header">
                <h2 className="section-title">Danh mục</h2>
                <button className="see-all-btn btn-ghost">Xem tất cả</button>
            </div>
            <div className="category-scroll">
                {categories.map(({ id, label, icon: Icon, color }) => (
                    <button key={id} className="category-pill card">
                        <div className="icon-circle" style={{ backgroundColor: `${color}15`, color: color }}>
                            <Icon size={24} />
                        </div>
                        <span className="category-label">{label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CategoryPills;
