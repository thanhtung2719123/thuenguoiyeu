import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { ChevronLeft, ArrowUpRight, ArrowDownLeft, Wallet } from 'lucide-react';
import './Profile.css';

const TransactionHistory = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchTransactions = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('transactions')
                    .select('*')
                    .eq('user_id', user.uid)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                if (data) setTransactions(data);
            } catch (err) {
                console.error('Error fetching transactions:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [user]);

    return (
        <div className="profile-settings-page">
            <div className="profile-padding">
                <header className="page-header-row">
                    <button className="btn-icon btn-ghost" onClick={() => navigate(-1)}>
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="page-title">Lịch sử giao dịch</h1>
                </header>

                <div className="transactions-list">
                    {loading ? (
                        <div className="loading-state">
                            <p className="text-subtle">Đang tải giao dịch...</p>
                        </div>
                    ) : transactions.length > 0 ? (
                        transactions.map(tx => (
                            <div key={tx.id} className="transaction-item card glass">
                                <div className={`tx-icon-box ${tx.type === 'deposit' || tx.type === 'earning' ? 'green' : 'red'}`}>
                                    {tx.type === 'deposit' || tx.type === 'earning' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                                </div>
                                <div className="tx-info">
                                    <div className="tx-header">
                                        <span className="tx-type">{tx.description || tx.type}</span>
                                        <span className={`tx-amount ${tx.type === 'deposit' || tx.type === 'earning' ? 'text-success' : 'text-error'}`}>
                                            {tx.type === 'deposit' || tx.type === 'earning' ? '+' : '-'}{Number(tx.amount).toLocaleString('vi-VN')}₫
                                        </span>
                                    </div>
                                    <div className="tx-footer">
                                        <span className="tx-date text-subtle">
                                            {new Date(tx.created_at).toLocaleDateString('vi-VN', {
                                                day: '2-digit', month: '2-digit', year: 'numeric',
                                                hour: '2-digit', minute: '2-digit'
                                            })}
                                        </span>
                                        <span className="tx-status text-subtle uppercase">{tx.status}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-state card glass">
                            <div className="auth-icon-bg">
                                <Wallet size={48} className="text-subtle" />
                            </div>
                            <p className="text-subtle">Bạn chưa có giao dịch nào.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TransactionHistory;
