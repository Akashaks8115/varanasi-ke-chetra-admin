import React, { useEffect, useState } from 'react';
import { getTokens } from '../services/tokenApi';
import { UserToken } from '../../../types';
import './user-token-dashboard.css';

const UserTokenDashboard = () => {
    const [tokens, setTokens] = useState<UserToken[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedToken, setSelectedToken] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchTokens = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getTokens();
                if (response.success) {
                    setTokens(response.data);
                } else {
                    setError('Failed to fetch tokens: ' + (response as any).message);
                }
            } catch (err: any) {
                setError('An error occurred while fetching tokens: ' + err.message);
                console.error('Fetch tokens dashboard error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchTokens();
    }, []);

    const handleViewToken = (token: string) => {
        setSelectedToken(token);
        setIsModalOpen(true);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Token copied to clipboard!');
    };

    return (
        <div className="user-token-dashboard">
            <header className="dashboard-header">
                <h2>User Tokens</h2>
            </header>

            {loading ? (
                <div className="loading">Loading tokens...</div>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : (
                <div className="tokens-container">
                    <table className="tokens-table">
                        <thead>
                            <tr>
                                <th>User ID</th>
                                <th>Token</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tokens.length > 0 ? (
                                tokens.map((token) => {
                                    const tokenId = typeof token._id === 'string' ? token._id : token._id?.$oid || '';
                                    return (
                                        <tr key={tokenId}>
                                            <td className="user-id">{token.userId}</td>
                                            <td className="token-cell">
                                                <div className="token-text">{token.token}</div>
                                            </td>
                                            <td>
                                                <button
                                                    className="view-btn"
                                                    onClick={() => handleViewToken(token.token)}
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={3} className="no-data">No tokens found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
            {isModalOpen && selectedToken && (
                <div className="token-modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="token-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Full User Token</h3>
                            <button className="close-modal" onClick={() => setIsModalOpen(false)}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <div className="full-token-text">{selectedToken}</div>
                        </div>
                        <div className="modal-footer">
                            <button className="copy-btn-modal" onClick={() => copyToClipboard(selectedToken)}>
                                Copy Token
                            </button>
                            <button className="close-btn-modal" onClick={() => setIsModalOpen(false)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserTokenDashboard;
