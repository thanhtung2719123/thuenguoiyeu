import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import {
    Save,
    ArrowLeft,
    User,
    MapPin,
    DollarSign,
    AlignLeft,
    Loader2
} from 'lucide-react';
import ImageUpload from '../components/ImageUpload';
import './PartnerProfileEditor.css';

const SKILL_OPTIONS = [
    'Wedding Date', 'Cafe Buddy', 'Tour Guide', 'Family Dinner',
    'Movie Partner', 'Photography', 'Shopping Assistant', 'Gym Buddy',
    'Fluent English', 'Fluent Korean', 'Driving'
];

const PartnerProfileEditor = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<any>({
        display_name: '',
        bio: '',
        location: '',
        price_per_hour: 0,
        skills: [],
        avatar_url: '',
        gallery: []
    });

    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                const { data: partnerData, error: partnerError } = await supabase
                    .from('partners')
                    .select('*, profiles(*)')
                    .eq('id', user.uid)
                    .single();

                if (partnerError) throw partnerError;

                if (partnerData) {
                    setProfile({
                        display_name: partnerData.profiles?.display_name || '',
                        bio: partnerData.profiles?.bio || '',
                        location: partnerData.location || '',
                        price_per_hour: partnerData.price_per_hour || 0,
                        skills: partnerData.skills || [],
                        avatar_url: partnerData.profiles?.avatar_url || '',
                        gallery: partnerData.gallery || []
                    });
                }
            } catch (err) {
                console.error('Error fetching partner data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const handleToggleSkill = (skill: string) => {
        setProfile((prev: any) => ({
            ...prev,
            skills: prev.skills.includes(skill)
                ? prev.skills.filter((s: string) => s !== skill)
                : [...prev.skills, skill]
        }));
    };

    const handleSave = async () => {
        if (!user) return;
        try {
            setSaving(true);

            // Update Profile
            await supabase
                .from('profiles')
                .update({
                    display_name: profile.display_name,
                    bio: profile.bio,
                    avatar_url: profile.avatar_url
                } as any)
                .eq('id', user.uid);

            // Update Partner
            const { error: partnerError } = await supabase
                .from('partners')
                .update({
                    location: profile.location,
                    price_per_hour: profile.price_per_hour,
                    skills: profile.skills,
                    gallery: profile.gallery,
                    updated_at: new Date().toISOString()
                } as any)
                .eq('id', user.uid);

            if (partnerError) throw partnerError;

            navigate('/partner-dashboard');
        } catch (err) {
            console.error('Error saving profile:', err);
            alert('Có lỗi xảy ra khi lưu thông tin.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="profile-editor-page">
                <div className="loading-state">
                    <Loader2 className="spinner" />
                    <p>Đang tải...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-editor-page">
            <header className="editor-header glass">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={20} />
                </button>
                <h1 className="header-title">Chỉnh sửa hồ sơ Đối tác</h1>
                <button className="save-btn pink-text" onClick={handleSave} disabled={saving}>
                    {saving ? <Loader2 className="spinner" size={20} /> : <Save size={20} />}
                    <span>Lưu</span>
                </button>
            </header>

            <div className="editor-content scroll-y">
                <section className="editor-section">
                    <h2 className="section-title">Ảnh đại diện</h2>
                    <div className="avatar-edit-container">
                        <div className="current-avatar">
                            <img src={profile.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200"} alt="Current" />
                        </div>
                        <div className="upload-wrapper">
                            <ImageUpload
                                bucket="avatars"
                                onUploadSuccess={(url) => setProfile((prev: any) => ({ ...prev, avatar_url: url }))}
                                label="Đổi ảnh"
                            />
                        </div>
                    </div>
                </section>

                <section className="editor-section">
                    <h2 className="section-title">Thông tin cơ bản</h2>
                    <div className="input-group card">
                        <div className="input-item">
                            <User size={18} className="input-icon" />
                            <input
                                type="text"
                                value={profile.display_name}
                                onChange={e => setProfile((prev: any) => ({ ...prev, display_name: e.target.value }))}
                                placeholder="Họ và tên"
                            />
                        </div>
                        <div className="input-item">
                            <MapPin size={18} className="input-icon" />
                            <input
                                type="text"
                                value={profile.location}
                                onChange={e => setProfile((prev: any) => ({ ...prev, location: e.target.value }))}
                                placeholder="Vị trí (vd: Hà Nội)"
                            />
                        </div>
                        <div className="input-item">
                            <DollarSign size={18} className="input-icon" />
                            <input
                                type="number"
                                value={profile.price_per_hour}
                                onChange={e => setProfile((prev: any) => ({ ...prev, price_per_hour: parseInt(e.target.value) }))}
                                placeholder="Giá mỗi giờ (₫)"
                            />
                        </div>
                    </div>
                </section>

                <section className="editor-section">
                    <h2 className="section-title">Giới thiệu bản thân</h2>
                    <div className="input-group card">
                        <div className="input-item multi-line">
                            <AlignLeft size={18} className="input-icon" />
                            <textarea
                                value={profile.bio}
                                onChange={e => setProfile((prev: any) => ({ ...prev, bio: e.target.value }))}
                                placeholder="Kể về bản thân bạn..."
                                rows={4}
                            />
                        </div>
                    </div>
                </section>

                <section className="editor-section">
                    <h2 className="section-title">Kỹ năng & Dịch vụ</h2>
                    <div className="skills-grid">
                        {SKILL_OPTIONS.map(skill => (
                            <button
                                key={skill}
                                className={`skill-chip ${profile.skills.includes(skill) ? 'active' : ''}`}
                                onClick={() => handleToggleSkill(skill)}
                            >
                                {skill}
                            </button>
                        ))}
                    </div>
                </section>

                <section className="editor-section">
                    <h2 className="section-title">Bộ sưu tập ảnh (Gallery)</h2>
                    <div className="gallery-preview">
                        {profile.gallery && profile.gallery.map((url: string, index: number) => (
                            <div key={index} className="gallery-item">
                                <img src={url} alt={`Gallery ${index}`} />
                            </div>
                        ))}
                    </div>
                    <ImageUpload
                        bucket="galleries"
                        onUploadSuccess={(url) => setProfile((prev: any) => ({ ...prev, gallery: [...prev.gallery, url] }))}
                        label="Thêm ảnh vào bộ sưu tập"
                    />
                </section>

                <div className="bottom-spacing" />
            </div>
        </div>
    );
};

export default PartnerProfileEditor;
