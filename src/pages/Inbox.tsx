import { useState } from 'react';
import { Search, Send, ShieldCheck, MoreVertical } from 'lucide-react';
import './Inbox.css';

const MOCK_CHATS = [
    {
        id: 1,
        name: 'Linh Nguyen',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
        lastMessage: "Looking forward to our coffee date tomorrow! See you at Starbucks.",
        time: '12:45 PM',
        unread: 1,
        status: 'Booking Confirmed'
    },
    {
        id: 2,
        name: 'Minh Tran',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=800',
        lastMessage: "I've accepted your request. Where should we meet?",
        time: 'Yesterday',
        unread: 0,
        status: 'Booking Accepted'
    }
];

const Inbox = () => {
    const [selectedChat, setSelectedChat] = useState<any>(null);

    if (selectedChat) {
        return (
            <div className="chat-view">
                <header className="chat-header glass">
                    <button className="back-link btn-ghost" onClick={() => setSelectedChat(null)}>
                        ←
                    </button>
                    <div className="chat-profile">
                        <img src={selectedChat.avatar} alt={selectedChat.name} className="mini-avatar" />
                        <div>
                            <div className="chat-name">{selectedChat.name}</div>
                            <div className="chat-status-text pink-text">{selectedChat.status}</div>
                        </div>
                    </div>
                    <MoreVertical size={20} className="text-subtle" />
                </header>

                <div className="messages-container">
                    <div className="message-notice">
                        <ShieldCheck size={14} />
                        This chat is encrypted and active for your confirmed booking.
                    </div>

                    <div className="message incoming">
                        <div className="message-content">
                            {selectedChat.lastMessage}
                        </div>
                        <div className="message-time">{selectedChat.time}</div>
                    </div>

                    <div className="message outgoing">
                        <div className="message-content">
                            Got it! I'll be there on time. See you soon!
                        </div>
                        <div className="message-time">12:50 PM</div>
                    </div>
                </div>

                <div className="message-input-area glass">
                    <div className="input-box">
                        <input type="text" placeholder="Type a message..." />
                        <button className="send-btn btn-primary">
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="inbox-page">
            <div className="inbox-padding">
                <h1 className="page-title">Messages</h1>

                <div className="search-bar-mini card glass">
                    <Search size={18} className="text-subtle" />
                    <input type="text" placeholder="Search conversations..." />
                </div>

                <div className="chats-list">
                    {MOCK_CHATS.map(chat => (
                        <div key={chat.id} className="chat-item card" onClick={() => setSelectedChat(chat)}>
                            <div className="chat-avatar-wrapper">
                                <img src={chat.avatar} alt={chat.name} className="chat-avatar" />
                                {chat.unread > 0 && <div className="unread-dot" />}
                            </div>
                            <div className="chat-content">
                                <div className="chat-header-row">
                                    <h3 className="chat-name">{chat.name}</h3>
                                    <span className="chat-time text-subtle">{chat.time}</span>
                                </div>
                                <div className="chat-status-badge">{chat.status}</div>
                                <p className="chat-last-message text-subtle">{chat.lastMessage}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Inbox;
