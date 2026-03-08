import { useState, useEffect } from 'react';
import { Search, Send, ShieldCheck, MoreVertical, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import './Inbox.css';

const Inbox = () => {
    const { user, signInWithGoogle } = useAuth();
    const [selectedChat, setSelectedChat] = useState<any>(null);
    const [chats, setChats] = useState<any[]>([]);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchChats = async () => {
            try {
                setLoading(true);
                // Fetch bookings where user is involved (as renter or partner)
                const { data, error } = await supabase
                    .from('bookings')
                    .select(`
                        id,
                        status,
                        renter_id,
                        partner_id,
                        partners (
                            profiles (
                                id,
                                display_name,
                                avatar_url
                            )
                        ),
                        profiles!renter_id (
                            id,
                            display_name,
                            avatar_url
                        )
                    `)
                    .or(`renter_id.eq.${user.uid},partner_id.eq.${user.uid}`)
                    .order('created_at', { ascending: false });

                if (error) throw error;

                if (data) {
                    const formattedChats = data.map((b: any) => {
                        const isRenter = b.renter_id === user.uid;
                        const otherParty = isRenter ? b.partners?.profiles : b.profiles;
                        return {
                            id: b.id,
                            name: otherParty?.display_name || 'Người dùng ẩn danh',
                            avatar: otherParty?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
                            status: b.status === 'confirmed' ? 'Đã xác nhận' : 'Đang chờ',
                            otherId: otherParty?.id
                        };
                    });
                    setChats(formattedChats);
                }
            } catch (err) {
                console.error('Error fetching chats:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchChats();
    }, [user]);

    useEffect(() => {
        if (!selectedChat) return;

        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .or(`and(sender_id.eq.${user?.uid},receiver_id.eq.${selectedChat.otherId}),and(sender_id.eq.${selectedChat.otherId},receiver_id.eq.${user?.uid})`)
                .order('created_at', { ascending: true });

            if (data) setMessages(data);
        };

        fetchMessages();

        // Subscribe to real-time messages
        const channel = supabase
            .channel(`chat_${selectedChat.id}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `receiver_id=eq.${user?.uid}`
            }, (payload) => {
                setMessages(prev => [...prev, payload.new]);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [selectedChat, user]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !user || !selectedChat) return;

        try {
            const { data, error } = await supabase
                .from('messages')
                .insert({
                    sender_id: user.uid,
                    receiver_id: selectedChat.otherId,
                    content: newMessage
                })
                .select()
                .single();

            if (error) throw error;
            if (data) {
                setMessages(prev => [...prev, data]);
                setNewMessage('');
            }
        } catch (err) {
            console.error('Error sending message:', err);
        }
    };

    if (!user) {
        return (
            <div className="inbox-page">
                <div className="inbox-padding">
                    <h1 className="page-title">Tin nhắn</h1>
                    <div className="card glass auth-prompt-card">
                        <div className="auth-icon-bg">
                            <LogIn size={48} className="pink-text" />
                        </div>
                        <h2>Bạn chưa đăng nhập</h2>
                        <p className="text-subtle">Vui lòng đăng nhập để xem tin nhắn và trò chuyện.</p>
                        <button className="btn btn-primary w-full" onClick={signInWithGoogle}>
                            Đăng nhập với Google
                        </button>
                    </div>
                </div>
            </div>
        );
    }

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
                        Tin nhắn được bảo mật và chỉ hiển thị khi có lịch đặt.
                    </div>

                    {messages.map((msg, idx) => (
                        <div key={idx} className={`message ${msg.sender_id === user.uid ? 'outgoing' : 'incoming'}`}>
                            <div className="message-content">
                                {msg.content}
                            </div>
                            <div className="message-time">
                                {new Date(msg.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="message-input-area glass">
                    <div className="input-box">
                        <input
                            type="text"
                            placeholder="Nhập tin nhắn..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <button className="send-btn btn-primary" onClick={handleSendMessage}>
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
                <h1 className="page-title">Tin nhắn</h1>

                <div className="search-bar-mini card glass">
                    <Search size={18} className="text-subtle" />
                    <input type="text" placeholder="Tìm kiếm cuộc hội thoại..." />
                </div>

                {loading ? (
                    <div className="loading-state">
                        <p className="text-subtle">Đang tải tin nhắn...</p>
                    </div>
                ) : chats.length > 0 ? (
                    <div className="chats-list">
                        {chats.map(chat => (
                            <div key={chat.id} className="chat-item card" onClick={() => setSelectedChat(chat)}>
                                <div className="chat-avatar-wrapper">
                                    <img src={chat.avatar} alt={chat.name} className="chat-avatar" />
                                </div>
                                <div className="chat-content">
                                    <div className="chat-header-row">
                                        <h3 className="chat-name">{chat.name}</h3>
                                        <span className="chat-time text-subtle">Mới</span>
                                    </div>
                                    <div className="chat-status-badge">{chat.status}</div>
                                    <p className="chat-last-message text-subtle">Bấm để bắt đầu chat</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state card glass">
                        <p className="text-subtle">Bạn chưa có cuộc trò chuyện nào. Hãy đặt lịch ngay nhé!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Inbox;
