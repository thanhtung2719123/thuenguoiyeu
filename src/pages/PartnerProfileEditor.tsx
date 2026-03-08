import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Save,
    ArrowLeft,
    User,
    MapPin,
    DollarSign,
    AlignLeft
} from 'lucide-react';
import ImageUpload from '../components/ImageUpload';
import './PartnerProfileEditor.css';

const SKILL_OPTIONS = [
    'Wedding Date', 'Cafe Buddy', 'Tour Guide', 'Family Dinner',
    'Movie Partner', 'Photography', 'Shopping Assistant', 'Gym Buddy',
    'Fluent English', 'Fluent Korean', 'Driving'
];

const PartnerProfileEditor = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        name: 'Linh Nguyen',
        bio: 'Friendly and outgoing. Love cafe hopping and deep conversations.',
        location: 'Hanoi',
        price: 35,
        skills: ['Cafe Buddy', 'Movie Partner', 'Photography'],
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200'
    });

    const handleToggleSkill = (skill: string) => {
        setProfile(prev => ({
            ...prev,
            skills: prev.skills.includes(skill)
                ? prev.skills.filter(s => s !== skill)
                : [...prev.skills, skill]
        }));
    };

    const handleSave = () => {
        // Logic to save to Supabase will go here
        console.log('Saving profile:', profile);
        navigate('/partner-dashboard');
    };

    return (
        <div className="profile-editor-page">
            <header className="editor-header glass">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={20} />
                </button>
                <h1 className="header-title">Edit Profile</h1>
                <button className="save-btn pink-text" onClick={handleSave}>
                    <Save size={20} />
                    <span>Save</span>
                </button>
            </header>

            <div className="editor-content scroll-y">
                <section className="editor-section">
                    <h2 className="section-title">Profile Photo</h2>
                    <div className="avatar-edit-container">
                        <div className="current-avatar">
                            <img src={profile.avatarUrl} alt="Current" />
                        </div>
                        <div className="upload-wrapper">
                            <ImageUpload
                                bucket="avatars"
                                onUploadSuccess={(url) => setProfile(prev => ({ ...prev, avatarUrl: url }))}
                                label="Change Avatar"
                            />
                        </div>
                    </div>
                </section>

                <section className="editor-section">
                    <h2 className="section-title">Basic Information</h2>
                    <div className="input-group card">
                        <div className="input-item">
                            <User size={18} className="input-icon" />
                            <input
                                type="text"
                                value={profile.name}
                                onChange={e => setProfile(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Full Name"
                            />
                        </div>
                        <div className="input-item">
                            <MapPin size={18} className="input-icon" />
                            <input
                                type="text"
                                value={profile.location}
                                onChange={e => setProfile(prev => ({ ...prev, location: e.target.value }))}
                                placeholder="Location (e.g. Hanoi)"
                            />
                        </div>
                        <div className="input-item">
                            <DollarSign size={18} className="input-icon" />
                            <input
                                type="number"
                                value={profile.price}
                                onChange={e => setProfile(prev => ({ ...prev, price: parseInt(e.target.value) }))}
                                placeholder="Price per hour ($)"
                            />
                        </div>
                    </div>
                </section>

                <section className="editor-section">
                    <h2 className="section-title">About Me</h2>
                    <div className="input-group card">
                        <div className="input-item multi-line">
                            <AlignLeft size={18} className="input-icon" />
                            <textarea
                                value={profile.bio}
                                onChange={e => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                                placeholder="Tell users about yourself..."
                                rows={4}
                            />
                        </div>
                    </div>
                </section>

                <section className="editor-section">
                    <h2 className="section-title">Skills & Services</h2>
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
                    <h2 className="section-title">Vibe Gallery</h2>
                    <ImageUpload
                        bucket="galleries"
                        onUploadSuccess={(url) => console.log('Gallery upload:', url)}
                        label="Add to Gallery"
                    />
                </section>

                <div className="bottom-spacing" />
            </div>
        </div>
    );
};

export default PartnerProfileEditor;
