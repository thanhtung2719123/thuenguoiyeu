import { X, Calendar, Clock, MapPin, CreditCard, ShieldCheck } from 'lucide-react';
import './BookingModal.css';

interface BookingModalProps {
    partner: any;
    onClose: () => void;
    onConfirm: () => void;
}

const BookingModal = ({ partner, onClose, onConfirm }: BookingModalProps) => {
    return (
        <div className="modal-overlay">
            <div className="booking-modal card glass">
                <div className="modal-header">
                    <h2 className="modal-title">Book your Date</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="partner-mini-card">
                    <img src={partner.imageUrl} alt={partner.name} className="mini-avatar" />
                    <div className="mini-info">
                        <div className="mini-name">{partner.name}</div>
                        <div className="mini-price pink-text">${partner.price}/hr</div>
                    </div>
                </div>

                <div className="form-section">
                    <label className="input-label">Select Date</label>
                    <div className="input-wrapper">
                        <Calendar size={18} className="input-icon" />
                        <input type="date" className="booking-input" defaultValue="2026-03-09" />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-section">
                        <label className="input-label">Start Time</label>
                        <div className="input-wrapper">
                            <Clock size={18} className="input-icon" />
                            <input type="time" className="booking-input" defaultValue="19:00" />
                        </div>
                    </div>
                    <div className="form-section">
                        <label className="input-label">Duration (Hrs)</label>
                        <div className="input-wrapper">
                            <input type="number" className="booking-input" defaultValue="2" min="1" max="8" />
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <label className="input-label">Meeting Point</label>
                    <div className="input-wrapper">
                        <MapPin size={18} className="input-icon" />
                        <input type="text" className="booking-input" placeholder="e.g. Starbucks Hoan Kiem" />
                    </div>
                </div>

                <div className="escrow-notice">
                    <div className="escrow-header">
                        <ShieldCheck size={18} className="pink" />
                        <span className="escrow-title">Secure Escrow Payment</span>
                    </div>
                    <p className="escrow-text">
                        Your payment is held securely and only released to the partner 24 hours after your date ends.
                    </p>
                </div>

                <div className="payment-summary">
                    <div className="summary-row">
                        <span>2 hours x ${partner.price}</span>
                        <span>${partner.price * 2}</span>
                    </div>
                    <div className="summary-row">
                        <span>Service Fee</span>
                        <span>$5.00</span>
                    </div>
                    <div className="summary-row total">
                        <span>Total</span>
                        <span>${partner.price * 2 + 5}</span>
                    </div>
                </div>

                <button className="btn btn-primary w-full confirm-btn" onClick={onConfirm}>
                    <CreditCard size={20} />
                    Confirm & Pay
                </button>
            </div>
        </div>
    );
};

export default BookingModal;
