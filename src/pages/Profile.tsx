import { useNavigate } from 'react-router-dom';
import { usePartner } from '../context/PartnerContext';
import { useAuth } from '../context/AuthContext';
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
    LogIn
} from 'lucide-react';
import './Profile.css';

const Profile = () => {
    const { isPartnerMode, togglePartnerMode } = usePartner();
    const { user, logout, signInWithGoogle } = useAuth();
    const navigate = useNavigate();

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

    return (
        <div className="profile-settings-page">
            <div className="profile-padding">
                <h1 className="page-title">Tài khoản của tôi</h1>

                {/* User Card */}
                <div className="user-profile-card card glass">
                    <div className="user-avatar-box">
                        <img src={user.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200"} alt="user" className="user-large-avatar" />
                        <div className="edit-badge">
                            <Settings size={14} />
                        </div>
                    </div>
                    <div className="user-main-info">
                        <h2 className="user-display-name">{user.displayName || 'Người dùng'}</h2>
                        <div className="verification-status verified">
                            <ShieldCheck size={14} />
                            Đã xác minh danh tính (e-KYC)
                        </div>
                    </div>
                </div>

                {/* Wallet Section */}
                <section className="settings-section">
                    <h2 className="section-title">Ví & Thanh toán</h2>
                    <div className="wallet-card card gradient-primary">
                        <div className="wallet-header">
                            <span className="wallet-label">Số dư hiện tại</span>
                            <Wallet size={20} />
                        </div>
                        <div className="balance-amount">3.000.000₫</div>
                        <div className="wallet-footer">
                            <span className="masked-card">•••• 4242</span>
                            <button className="top-up-btn">Nạp tiền</button>
                        </div>
                    </div>

                    <div className="settings-list card">
                        <div className="settings-item">
                            <div className="settings-icon-box blue"><History size={18} /></div>
                            <span className="settings-label">Lịch sử giao dịch</span>
                            <ChevronRight size={18} className="text-subtle" />
                        </div>
                        <div className="settings-item">
                            <div className="settings-icon-box orange"><CreditCard size={18} /></div>
                            <span className="settings-label">Tài khoản liên kết (MoMo)</span>
                            <span className="settings-value">Đã kết nối</span>
                            <ChevronRight size={18} className="text-subtle" />
                        </div>
                    </div>
                </section>

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
