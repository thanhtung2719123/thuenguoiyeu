import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
    const { signInWithGoogle, user } = useAuth();
    const navigate = useNavigate();

    if (user) {
        navigate('/');
        return null;
    }

    return (
        <div className="login-page">
            <div className="login-content glass">
                <div className="login-header">
                    <div className="app-logo">
                        <span className="logo-text gradient-text">Thuê người yêu</span>
                    </div>
                    <h1 className="login-title">Chào mừng trở lại</h1>
                    <p className="login-subtitle">Đăng nhập để tìm người bạn đồng hành hoàn hảo</p>
                </div>

                <div className="login-actions">
                    <button className="google-login-btn" onClick={signInWithGoogle}>
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
                        <span>Đăng nhập với Google</span>
                    </button>
                </div>

                <p className="login-footer">
                    Bằng cách đăng nhập, bạn đồng ý với Điều khoản và Chính sách của chúng tôi.
                </p>
            </div>
        </div>
    );
};

export default Login;
