import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { ChevronLeft, User, MapPin, AlignLeft, Save, Loader2 } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';
import './Profile.css'; // Reusing profile styles or adding specific ones

const EditProfile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        display_name: '',
        bio: '',
        location: '',
        avatar_url: ''
    });

    useEffect(() => {
        if (!user) return;

        const fetchProfile = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('profiles')
                    .select('display_name, bio, location, avatar_url')
                    .eq('id', user.uid)
                    .single();

                if (error) throw error;
                if (data) {
                    setFormData({
                        display_name: data.display_name || '',
                        bio: data.bio || '',
                        location: data.location || '',
                        avatar_url: data.avatar_url || ''
                    });
                }
            } catch (err) {
                console.error('Error fetching profile:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user]);

    const handleSave = async () => {
        if (!user) return;
        try {
            setSaving(true);
            const { error } = await supabase
                .from('profiles')
                .update({
                    display_name: formData.display_name,
                    bio: formData.bio,
                    location: formData.location,
                    avatar_url: formData.avatar_url,
                    updated_at: new Date().toISOString()
                } as any)
                .eq('id', user.uid);

            if (error) throw error;
            navigate('/profile');
        } catch (err) {
            console.error('Error saving profile:', err);
            alert('Có lỗi xảy ra khi lưu thông tin.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="profile-settings-page">
                <div className="profile-padding">
                    <div className="loading-state">
                        <Loader2 className="spinner" />
                        <p className="text-subtle">Đang tải...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-settings-page">
            <div className="profile-padding">
                <header className="page-header-row">
                    <button className="btn-icon btn-ghost" onClick={() => navigate(-1)}>
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="page-title">Sửa thông tin</h1>
                    <button className="btn-icon btn-ghost text-primary ml-auto" onClick={handleSave} disabled={saving}>
                        {saving ? <Loader2 className="spinner" size={20} /> : <Save size={20} />}
                    </button>
                </header>

                <div className="edit-profile-avatar-section">
                    <div className="user-avatar-box large">
                        <img src={formData.avatar_url || user?.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200"} alt="user" className="user-large-avatar" />
                    </div>
                    <ImageUpload
                        bucket="avatars"
                        onUploadSuccess={(url) => setFormData(prev => ({ ...prev, avatar_url: url }))}
                        label="Thay đổi ảnh đại diện"
                    />
                </div>

                <div className="input-group card glass">
                    <section className="input-field">
                        <label className="input-label">
                            <User size={16} />
                            <span>Tên hiển thị</span>
                        </label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.display_name}
                            onChange={e => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
                            placeholder="Nhập tên của bạn"
                        />
                    </section>

                    <section className="input-field">
                        <label className="input-label">
                            <MapPin size={16} />
                            <span>Vị trí</span>
                        </label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.location}
                            onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                            placeholder="Ví dụ: Hà Nội, Việt Nam"
                        />
                    </section>

                    <section className="input-field">
                        <label className="input-label">
                            <AlignLeft size={16} />
                            <span>Tiểu sử</span>
                        </label>
                        <textarea
                            className="form-textarea"
                            value={formData.bio}
                            onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                            placeholder="Kể về bản thân bạn..."
                            rows={4}
                        />
                    </section>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;
