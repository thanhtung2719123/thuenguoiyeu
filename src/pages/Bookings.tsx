import { useState } from 'react';
import { Clock, CheckCircle, Hourglass, CreditCard, ChevronRight, Info } from 'lucide-react';
import './Bookings.css';

const MOCK_BOOKINGS = [
    {
        id: 'B001',
        partnerName: 'Linh Nguyen',
        partnerImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
        date: 'Mar 10, 2026',
        time: '19:00',
        duration: '2 hours',
        status: 'Confirmed',
        paymentStatus: 'Escrow (Hold)',
        total: 75,
    },
    {
        id: 'B002',
        partnerName: 'Minh Tran',
        partnerImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=800',
        date: 'Mar 12, 2026',
        time: '14:00',
        duration: '3 hours',
        status: 'Pending',
        paymentStatus: 'Awaiting Acceptance',
        total: 140,
    }
];

const Bookings = () => {
    const [activeTab, setActiveTab] = useState('Upcoming');

    return (
        <div className="bookings-page">
            <div className="bookings-padding">
                <h1 className="page-title">My Bookings</h1>

                <div className="tabs-container card glass">
                    {['Upcoming', 'Past', 'Cancelled'].map(tab => (
                        <button
                            key={tab}
                            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="bookings-list">
                    {MOCK_BOOKINGS.filter(b => activeTab === 'Upcoming' ? b.status !== 'Cancelled' : true).map(booking => (
                        <div key={booking.id} className="booking-card card">
                            <div className="booking-main">
                                <img src={booking.partnerImage} alt={booking.partnerName} className="booking-avatar" />
                                <div className="booking-info">
                                    <div className="booking-header-row">
                                        <h3 className="booking-partner-name">{booking.partnerName}</h3>
                                        <div className="booking-id">#{booking.id}</div>
                                    </div>
                                    <div className="booking-time-row text-subtle">
                                        <Clock size={14} />
                                        {booking.date} at {booking.time} ({booking.duration})
                                    </div>
                                </div>
                            </div>

                            <div className="booking-divider" />

                            <div className="status-row">
                                <div className="status-item">
                                    <div className="status-label text-subtle">Date Status</div>
                                    <div className={`status-pill ${booking.status.toLowerCase()}`}>
                                        {booking.status === 'Confirmed' ? <CheckCircle size={12} /> : <Hourglass size={12} />}
                                        {booking.status}
                                    </div>
                                </div>
                                <div className="status-item">
                                    <div className="status-label text-subtle">Payment (Escrow)</div>
                                    <div className="payment-status">
                                        <CreditCard size={12} />
                                        {booking.paymentStatus}
                                    </div>
                                </div>
                            </div>

                            <div className="booking-footer">
                                <div className="total-label">Subtotal: <span className="total-amount">${booking.total}</span></div>
                                <button className="btn btn-outline btn-sm details-btn">
                                    View Details
                                    <ChevronRight size={16} />
                                </button>
                            </div>

                            {booking.status === 'Confirmed' && (
                                <div className="escrow-badge">
                                    <Info size={14} />
                                    Safe Escrow active. Payment released 24h after completion.
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Bookings;
