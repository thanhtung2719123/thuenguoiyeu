import { useNavigate } from 'react-router-dom';
import { usePartner } from '../context/PartnerContext';
import {
    Wallet,
    ShieldCheck,
    Settings,
    LogOut,
    ChevronRight,
    HelpCircle,
    History,
    Repeat,
    CreditCard
} from 'lucide-react';
import './Profile.css';

const Profile = () => {
    const { isPartnerMode, togglePartnerMode } = usePartner();
    const navigate = useNavigate();

    const handleSwitchMode = () => {
        togglePartnerMode();
        if (!isPartnerMode) {
            navigate('/partner-dashboard');
        } else {
            navigate('/');
        }
    };
    return (
        <div className="profile-settings-page">
            <div className="profile-padding">
                <h1 className="page-title">My Account</h1>

                {/* User Card */}
                <div className="user-profile-card card glass">
                    <div className="user-avatar-box">
                        <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200" alt="user" className="user-large-avatar" />
                        <div className="edit-badge">
                            <Settings size={14} />
                        </div>
                    </div>
                    <div className="user-main-info">
                        <h2 className="user-display-name">Alex Johnson</h2>
                        <div className="verification-status verified">
                            <ShieldCheck size={14} />
                            Identity Verified (e-KYC)
                        </div>
                    </div>
                </div>

                {/* Wallet Section */}
                <section className="settings-section">
                    <h2 className="section-title">Wallet & Payments</h2>
                    <div className="wallet-card card gradient-primary">
                        <div className="wallet-header">
                            <span className="wallet-label">Current Balance</span>
                            <Wallet size={20} />
                        </div>
                        <div className="balance-amount">$120.50</div>
                        <div className="wallet-footer">
                            <span className="masked-card">•••• 4242</span>
                            <button className="top-up-btn">Top Up</button>
                        </div>
                    </div>

                    <div className="settings-list card">
                        <div className="settings-item">
                            <div className="settings-icon-box blue"><History size={18} /></div>
                            <span className="settings-label">Transaction History</span>
                            <ChevronRight size={18} className="text-subtle" />
                        </div>
                        <div className="settings-item">
                            <div className="settings-icon-box orange"><CreditCard size={18} /></div>
                            <span className="settings-label">Linked Accounts (MoMo)</span>
                            <span className="settings-value">Connected</span>
                            <ChevronRight size={18} className="text-subtle" />
                        </div>
                    </div>
                </section>

                {/* Mode Switching */}
                <section className="settings-section">
                    <h2 className="section-title">Account Mode</h2>
                    <div className="mode-switch-card card">
                        <div className="mode-info">
                            <div className="settings-icon-box purple"><Repeat size={18} /></div>
                            <div>
                                <div className="mode-name">{isPartnerMode ? 'Renter Mode' : 'Partner Mode'}</div>
                                <div className="mode-desc text-subtle">
                                    {isPartnerMode ? 'Switch back to explorer mode' : 'Earn money by being a companion'}
                                </div>
                            </div>
                        </div>
                        <button
                            className="btn btn-primary btn-sm switch-btn"
                            onClick={handleSwitchMode}
                        >
                            Switch
                        </button>
                    </div>
                </section>

                {/* General Settings */}
                <section className="settings-section">
                    <h2 className="section-title">General</h2>
                    <div className="settings-list card">
                        <div className="settings-item">
                            <div className="settings-icon-box pink"><Settings size={18} /></div>
                            <span className="settings-label">App Settings</span>
                            <ChevronRight size={18} className="text-subtle" />
                        </div>
                        <div className="settings-item">
                            <div className="settings-icon-box green"><HelpCircle size={18} /></div>
                            <span className="settings-label">Support & Safety</span>
                            <ChevronRight size={18} className="text-subtle" />
                        </div>
                        <div className="settings-item logout">
                            <div className="settings-icon-box red"><LogOut size={18} /></div>
                            <span className="settings-label">Logout</span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Profile;
