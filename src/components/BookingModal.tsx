import { useState } from 'react';
import { X, Calendar, Clock, MapPin, CreditCard, ShieldCheck } from 'lucide-react';
import './BookingModal.css';

interface BookingModalProps {
    partner: any;
    onClose: () => void;
    onConfirm: (bookingData: any) => void;
}

const BookingModal = ({ partner, onClose, onConfirm }: BookingModalProps) => {
    const today = new Date().toISOString().split('T')[0];
    const [date, setDate] = useState(today);
    const [time, setTime] = useState('19:00');
    const [duration, setDuration] = useState(2);
    const [location, setLocation] = useState('');

    const serviceFee = 50000;
    const totalPrice = (partner.price * duration) + serviceFee;

    const handleConfirm = () => {
        onConfirm({
            date,
            time,
            duration,
            location,
            totalPrice
        });
    };

    return (
        <div className="modal-overlay">
            <div className="booking-modal card glass">
                <div className="modal-header">
                    <h2 className="modal-title">Đặt lịch hẹn</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="partner-mini-card">
                    <img src={partner.imageUrl} alt={partner.name} className="mini-avatar" />
                    <div className="mini-info">
                        <div className="mini-name">{partner.name}</div>
                        <div className="mini-price pink-text">{partner.price.toLocaleString('vi-VN')}₫/giờ</div>
                    </div>
                </div>

                <div className="form-section">
                    <label className="input-label">Chọn Ngày</label>
                    <div className="input-wrapper">
                        <Calendar size={18} className="input-icon" />
                        <input
                            type="date"
                            className="booking-input"
                            value={date}
                            min={today}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-section">
                        <label className="input-label">Giờ bắt đầu</label>
                        <div className="input-wrapper">
                            <Clock size={18} className="input-icon" />
                            <input
                                type="time"
                                className="booking-input"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="form-section">
                        <label className="input-label">Số giờ</label>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="booking-input"
                                value={duration}
                                min="1"
                                max="12"
                                onChange={(e) => setDuration(parseInt(e.target.value))}
                            />
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <label className="input-label">Địa điểm hẹn</label>
                    <div className="input-wrapper">
                        <MapPin size={18} className="input-icon" />
                        <input
                            type="text"
                            className="booking-input"
                            placeholder="Ví dụ: Starbucks Hoàn Kiếm"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>
                </div>

                <div className="escrow-notice">
                    <div className="escrow-header">
                        <ShieldCheck size={18} className="pink" />
                        <span className="escrow-title">Thanh toán An toàn</span>
                    </div>
                    <p className="escrow-text">
                        Khoản thanh toán của bạn được giữ an toàn và chỉ giải ngân sau khi buổi hẹn kết thúc.
                    </p>
                </div>

                <div className="payment-summary">
                    <div className="summary-row">
                        <span>{duration} giờ x {partner.price.toLocaleString('vi-VN')}₫</span>
                        <span>{(partner.price * duration).toLocaleString('vi-VN')}₫</span>
                    </div>
                    <div className="summary-row">
                        <span>Phí dịch vụ</span>
                        <span>{serviceFee.toLocaleString('vi-VN')}₫</span>
                    </div>
                    <div className="summary-row total">
                        <span>Tổng thanh toán</span>
                        <span>{totalPrice.toLocaleString('vi-VN')}₫</span>
                    </div>
                </div>

                <button className="btn btn-primary w-full confirm-btn" onClick={handleConfirm}>
                    <CreditCard size={20} />
                    Xác nhận & Thanh toán
                </button>
            </div>
        </div>
    );
};

export default BookingModal;
