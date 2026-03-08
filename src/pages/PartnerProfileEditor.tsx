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
    Loader2,
    X,
    ChevronUp,
    ChevronDown
} from 'lucide-react';
import ImageUpload from '../components/ImageUpload';
import './PartnerProfileEditor.css';

const SKILL_OPTIONS = [
    { name: 'Communication', icon: '🗣️' },
    { name: 'Singing', icon: '🎤' },
    { name: 'Gaming', icon: '🎮' },
    { name: 'Movie Buddy', icon: '🍿' },
    { name: 'Tour Guide', icon: '🗺️' },
    { name: 'Shopping', icon: '🛍️' },
    { name: 'Gym Buddy', icon: '💪' },
    { name: 'Photography', icon: '📸' }
];

const PROVINCE_OPTIONS = [
    'Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ', 'Bình Dương', 'Đồng Nai'
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
        province: '',
        gender: '',
        birthday: '',
        price_per_hour: 0,
        game_tags: [],
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

                if (partnerError && partnerError.code !== 'PGRST116') throw partnerError;

                if (partnerData) {
                    setProfile({
                        display_name: partnerData.profiles?.display_name || '',
                        bio: partnerData.profiles?.bio || '',
                        location: partnerData.location || '',
                        province: partnerData.profiles?.province || '',
                        gender: partnerData.profiles?.gender || '',
                        birthday: partnerData.profiles?.birthday || '',
                        price_per_hour: partnerData.price_per_hour || 0,
                        game_tags: partnerData.game_tags || [],
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

    const handleToggleTag = (tag: string) => {
        setProfile((prev: any) => {
            const isSelected = prev.game_tags.includes(tag);
            if (!isSelected && prev.game_tags.length >= 3) {
                alert('Bạn chỉ được chọn tối đa 3 thẻ!');
                return prev;
            }
            return {
                ...prev,
                game_tags: isSelected
                    ? prev.game_tags.filter((t: string) => t !== tag)
                    : [...prev.game_tags, tag]
            };
        });
    };

    const handleMoveItem = (index: number, direction: 'up' | 'down') => {
        setProfile((prev: any) => {
            const newGallery = [...prev.gallery];
            const targetIndex = direction === 'up' ? index - 1 : index + 1;
            if (targetIndex < 0 || targetIndex >= newGallery.length) return prev;
            [newGallery[index], newGallery[targetIndex]] = [newGallery[targetIndex], newGallery[index]];
            return { ...prev, gallery: newGallery };
        });
    };

    const handleSave = async () => {
        if (!user) return;
        try {
            setSaving(true);

            // Update Profile
            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    display_name: profile.display_name,
                    bio: profile.bio,
                    avatar_url: profile.avatar_url,
                    province: profile.province,
                    gender: profile.gender,
                    birthday: profile.birthday
                } as any)
                .eq('id', user.uid);

            if (profileError) throw profileError;

            // Update Partner
            const { error: partnerError } = await supabase
                .from('partners')
                .update({
                    location: profile.location,
                    price_per_hour: profile.price_per_hour,
                    game_tags: profile.game_tags,
                    gallery: profile.gallery.slice(0, 15),
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
                <h1 className="header-title">Chỉnh sửa hồ sơ Companion</h1>
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
                                placeholder="Biệt danh"
                            />
                        </div>
                        <div className="input-item">
                            <MapPin size={18} className="input-icon" />
                            <select
                                value={profile.province}
                                onChange={e => setProfile((prev: any) => ({ ...prev, province: e.target.value }))}
                                className="province-select"
                            >
                                <option value="">Chọn Tỉnh/Thành</option>
                                {PROVINCE_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                        <div className="input-item">
                            <input
                                type="date"
                                value={profile.birthday}
                                onChange={e => setProfile((prev: any) => ({ ...prev, birthday: e.target.value }))}
                                className="date-input"
                            />
                        </div>
                        <div className="input-item">
                            <select
                                value={profile.gender}
                                onChange={e => setProfile((prev: any) => ({ ...prev, gender: e.target.value }))}
                                className="gender-select"
                            >
                                <option value="">Giới tính</option>
                                <option value="Male">Nam</option>
                                <option value="Female">Nữ</option>
                                <option value="Other">Khác</option>
                            </select>
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
                    <h2 className="section-title">Giới thiệu ngắn (Bio)</h2>
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
                    <div className="section-header-between">
                        <h2 className="section-title">Thẻ Game & Kỹ năng</h2>
                        <span className="tag-count">{profile.game_tags.length}/3</span>
                    </div>
                    <div className="skills-grid">
                        {SKILL_OPTIONS.map(skill => (
                            <button
                                key={skill.name}
                                className={`skill-card ${profile.game_tags.includes(skill.name) ? 'active' : ''}`}
                                onClick={() => handleToggleTag(skill.name)}
                            >
                                <span className="skill-icon">{skill.icon}</span>
                                <span className="skill-name">{skill.name}</span>
                                {profile.game_tags.includes(skill.name) && <div className="check-badge">✓</div>}
                            </button>
                        ))}
                    </div>
                </section>

                <section className="editor-section">
                    <div className="section-header-between">
                        <h2 className="section-title">Album & Gallery (Tối đa 15)</h2>
                        <span className="tag-count">{profile.gallery.length}/15</span>
                    </div>
                    <div className="gallery-preview">
                        {profile.gallery && profile.gallery.map((url: string, index: number) => (
                            <div key={index} className="gallery-item-wrapper">
                                <img src={url} alt={`Gallery ${index}`} />
                                <div className="gallery-actions">
                                    <button
                                        className="action-btn move-btn"
                                        onClick={() => handleMoveItem(index, 'up')}
                                        disabled={index === 0}
                                    >
                                        <ChevronUp size={14} />
                                    </button>
                                    <button
                                        className="action-btn move-btn"
                                        onClick={() => handleMoveItem(index, 'down')}
                                        disabled={index === profile.gallery.length - 1}
                                    >
                                        <ChevronDown size={14} />
                                    </button>
                                    <button
                                        className="action-btn remove-btn"
                                        onClick={() => setProfile((p: any) => ({ ...p, gallery: p.gallery.filter((_: any, i: number) => i !== index) }))}
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {profile.gallery.length < 15 && (
                            <ImageUpload
                                bucket="galleries"
                                onUploadSuccess={(url) => setProfile((prev: any) => ({ ...prev, gallery: [...prev.gallery, url] }))}
                                label=""
                            />
                        )}
                    </div>
                </section>

                <div className="bottom-spacing" />
            </div>
        </div>
    );
};

export default PartnerProfileEditor;
