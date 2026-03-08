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
    { id: 'wedding', label: 'Wedding Plus-One', icon: HeartHandshake, color: '#FF80AB' },
    { id: 'cafe', label: 'Cafe Buddy', icon: Coffee, color: '#A78BFA' },
    { id: 'tour', label: 'Local Guide', icon: Map, color: '#34D399' },
    { id: 'dinner', label: 'Fine Dining', icon: Utensils, color: '#FBBF24' },
    { id: 'photo', label: 'Photographer', icon: Camera, color: '#60A5FA' },
    { id: 'karaoke', label: 'Karaoke', icon: Music, color: '#F472B6' },
    { id: 'shopping', label: 'Shopping', icon: ShoppingBag, color: '#FB923C' },
];

const CategoryPills = () => {
    return (
        <div className="category-section">
            <div className="section-header">
                <h2 className="section-title">Categories</h2>
                <button className="see-all-btn btn-ghost">See All</button>
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
