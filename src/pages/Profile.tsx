import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePartner } from '../context/PartnerContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import {
    Wallet,
    ShieldCheck,
    Settings,
    LogOut,
    ChevronRight,
    HelpCircle,
    History,
    Repeat,
    CreditCard,
    LogIn,
    Clock,
    User as UserIcon,
    MapPin,
    AlignLeft,
    Save,
    Loader2
} from 'lucide-react';
import ImageUpload from '../components/ImageUpload';
import './Profile.css';

const Profile = () => {
    const { isPartnerMode, togglePartnerMode } = usePartner();
    const { user, logout, signInWithGoogle } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [isOnline, setIsOnline] = useState(false);
    const [loading, setLoading] = useState(true);
    const [savingProfile, setSavingProfile] = useState(false);
    const [isPartner, setIsPartner] = useState(false);
    const [formData, setFormData] = useState({
        display_name: '',
        bio: '',
        location: '',
        avatar_url: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) return;

        const fetchProfile = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.uid)
                    .single();

                if (error) throw error;
                if (data) {
                    setProfile(data);
                    setIsPartner(data.is_partner);
                    setFormData({
                        display_name: data.display_name || '',
                        bio: data.bio || '',
                        location: data.location || '',
                        avatar_url: data.avatar_url || ''
                    });

                    if (data.is_partner) {
                        const { data: partnerData } = await supabase
                            .from('partners')
                            .select('is_online')
                            .eq('id', user.uid)
                            .single();

                        if (partnerData) {
                            setIsOnline(partnerData.is_online);
                        }
                    }
                }
            } catch (err) {
                console.error('Error fetching profile:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user]);

    const handleSaveProfile = async () => {
        if (!user) return;
        try {
            setSavingProfile(true);
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
            setProfile((prev: any) => ({ ...prev, ...formData }));
            alert('Đã lưu thông tin cá nhân!');
        } catch (err) {
            console.error('Error saving profile:', err);
            alert('Có lỗi xảy ra khi lưu thông tin.');
        } finally {
            setSavingProfile(false);
        }
    };

    const handleToggleStatus = async () => {
        const nextStatus = !isOnline;
        setIsOnline(nextStatus);
        if (user) {
            await supabase
                .from('partners')
                .update({ is_online: nextStatus } as any)
                .eq('id', user.uid);
        }
    };

    const handleSwitchMode = () => {
        togglePartnerMode();
        if (!isPartnerMode) {
            navigate('/partner-dashboard');
        } else {
            navigate('/');
        }
    };

    if (!user) {
        return (
            <div className="profile-settings-page">
                <div className="profile-padding">
                    <h1 className="page-title">Cá nhân</h1>
                    <div className="card glass auth-prompt-card">
                        <div className="auth-icon-bg">
                            <LogIn size={48} className="pink-text" />
                        </div>
                        <h2>Bạn chưa đăng nhập</h2>
                        <p className="text-subtle">Đăng nhập ngay để theo dõi các đơn đặt và quản lý tài khoản.</p>
                        <button className="btn btn-primary w-full" onClick={signInWithGoogle}>
                            Đăng nhập với Google
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="profile-settings-page">
                <div className="profile-padding">
                    <div className="loading-state">
                        <p className="text-subtle">Đang tải thông tin...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-settings-page">
            <div className="profile-padding">
                <h1 className="page-title">Tài khoản của tôi</h1>

                {/* Editable User Profile Section */}
                <section className="settings-section">
                    <div className="section-header-row profile-editor-header">
                        <h2 className="section-title">Sửa thông tin</h2>
                        <button className="btn-icon btn-ghost pink-text" onClick={handleSaveProfile} disabled={savingProfile}>
                            {savingProfile ? <Loader2 className="spinner" size={24} /> : <Save size={24} />}
                        </button>
                    </div>

                    <div className="edit-profile-avatar-section">
                        <div className="user-avatar-box large mx-auto">
                            <img src={formData.avatar_url || profile?.avatar_url || user.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200"} alt="user" className="user-large-avatar" />
                        </div>
                        <div className="text-center mt-3 mb-4">
                            {profile?.is_verified ? (
                                <div className="verification-status verified justify-center">
                                    <ShieldCheck size={14} />
                                    Đã xác minh danh tính (e-KYC)
                                </div>
                            ) : (
                                <div className="verification-status unverified justify-center">
                                    <ShieldCheck size={14} className="text-subtle" />
                                    Chưa xác minh danh tính
                                </div>
                            )}
                        </div>
                        <ImageUpload
                            bucket="avatars"
                            onUploadSuccess={(url) => setFormData(prev => ({ ...prev, avatar_url: url }))}
                            label="Thay đổi ảnh đại diện"
                        />
                    </div>

                    <div className="input-group card glass no-margin">
                        <section className="input-field">
                            <label className="input-label">
                                <UserIcon size={16} />
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
                </section>

                {/* Wallet Section */}
                <section className="settings-section">
                    <h2 className="section-title">Ví & Thanh toán</h2>
                    <div className="wallet-card card gradient-primary">
                        <div className="wallet-header">
                            <span className="wallet-label">Số dư hiện tại</span>
                            <Wallet size={20} />
                        </div>
                        <div className="balance-amount">{Number(profile?.balance || 0).toLocaleString('vi-VN')}₫</div>
                        <div className="wallet-footer">
                            <span className="masked-card">Mã ví: {user.uid.substring(0, 8).toUpperCase()}</span>
                            <button className="top-up-btn">Nạp tiền</button>
                        </div>
                    </div>

                    <div className="settings-list card">
                        <div className="settings-item" onClick={() => navigate('/transaction-history')}>
                            <div className="settings-icon-box blue"><History size={18} /></div>
                            <span className="settings-label">Lịch sử giao dịch</span>
                            <ChevronRight size={18} className="text-subtle" />
                        </div>
                        <div className="settings-item">
                            <div className="settings-icon-box orange"><CreditCard size={18} /></div>
                            <span className="settings-label">Tài khoản liên kết</span>
                            <span className="settings-value">Tự động</span>
                            <ChevronRight size={18} className="text-subtle" />
                        </div>
                    </div>
                </section>

                {/* Online Status for Partners */}
                {isPartner && (
                    <section className="settings-section">
                        <h2 className="section-title">Trạng thái hoạt động</h2>
                        <div className="mode-switch-card card">
                            <div className="mode-info">
                                <div className={`settings-icon-box ${isOnline ? 'green' : 'gray'}`}><Clock size={18} /></div>
                                <div>
                                    <div className="mode-name">{isOnline ? 'Đang rảnh' : 'Đang bận / Ngoại tuyến'}</div>
                                    <div className="mode-desc text-subtle">
                                        {isOnline ? 'Khách hàng có thể nhìn thấy và thuê bạn' : 'Tạm ẩn hồ sơ khỏi danh sách khám phá'}
                                    </div>
                                </div>
                            </div>
                            <button
                                className={`toggle-switch ${isOnline ? 'on' : 'off'}`}
                                onClick={handleToggleStatus}
                            >
                                <div className="toggle-handle" />
                            </button>
                        </div>
                    </section>
                )}

                {/* Mode Switching */}
                <section className="settings-section">
                    <h2 className="section-title">Chế độ tài khoản</h2>
                    <div className="mode-switch-card card">
                        <div className="mode-info">
                            <div className="settings-icon-box purple"><Repeat size={18} /></div>
                            <div>
                                <div className="mode-name">{isPartnerMode ? 'Chế độ Người thuê' : 'Chế độ Đối tác'}</div>
                                <div className="mode-desc text-subtle">
                                    {isPartnerMode ? 'Quay lại chế độ khám phá' : 'Kiếm tiền bằng cách làm bạn đồng hành'}
                                </div>
                            </div>
                        </div>
                        <button
                            className="btn btn-primary btn-sm switch-btn"
                            onClick={handleSwitchMode}
                        >
                            Chuyển đổi
                        </button>
                    </div>
                </section>

                {/* General Settings */}
                <section className="settings-section">
                    <h2 className="section-title">Cài đặt chung</h2>
                    <div className="settings-list card">
                        <div className="settings-item">
                            <div className="settings-icon-box pink"><Settings size={18} /></div>
                            <span className="settings-label">Cài đặt ứng dụng</span>
                            <ChevronRight size={18} className="text-subtle" />
                        </div>
                        <div className="settings-item">
                            <div className="settings-icon-box green"><HelpCircle size={18} /></div>
                            <span className="settings-label">Hỗ trợ & An toàn</span>
                            <ChevronRight size={18} className="text-subtle" />
                        </div>
                        <div className="settings-item logout" onClick={logout}>
                            <div className="settings-icon-box red"><LogOut size={18} /></div>
                            <span className="settings-label">Đăng xuất</span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Profile;
