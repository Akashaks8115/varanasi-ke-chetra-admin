import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGhatsItems } from '../services/ghatApi';
import { VKCEntity } from '../../../types';
import './ghat-dashboard.css';

const GhatDashboard = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState<VKCEntity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getGhatsItems(1, 50);
                if (response.success) {
                    setItems(response.Data);
                } else {
                    setError(response.message);
                }
            } catch (err) {
                setError('Failed to fetch data. Please check if the API server is running.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getItemId = (item: VKCEntity) => {
        if (typeof item._id === 'string') return item._id;
        return item._id.$oid;
    };

    return (
        <div className="ghat-dashboard">
            <header className="dashboard-header">
                <h2>Ghats Management</h2>
                <button
                    className="add-btn"
                    onClick={() => navigate('/ghat/add')}
                >
                    + Add New Ghat
                </button>
            </header>

            {loading ? (
                <div className="loading">Loading ghats...</div>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : (
                <div className="items-grid">
                    {items.length > 0 ? (
                        items.map((item) => (
                            <div key={getItemId(item)} className="item-card">
                                <div className="card-image">
                                    <img src={item.ProfileUrl} alt={item.Title} onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=No+Image';
                                    }} />
                                    <div className="status-badge" data-show={item.IsShow !== 0}>
                                        {item.IsShow !== 0 ? 'Visible' : 'Hidden'}
                                    </div>
                                </div>
                                <div className="card-content">
                                    <h3>{item.Title}</h3>
                                    <p className="subtitle">{item.SubTitle}</p>
                                    {item.Address && <p className="address">📍 {item.Address}</p>}
                                    <div className="card-actions">
                                        <button className="edit-btn">Edit</button>
                                        <button className="delete-btn">Delete</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-data">No ghats found.</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default GhatDashboard;
