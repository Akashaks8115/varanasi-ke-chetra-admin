import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHistoricalPlacesItems, deleteHistoricalPlace } from '../services/historicalPlaceApi';
import { VKCEntity } from '../../../types';
import './historical-place-dashboard.css';

const HistoricalPlaceDashboard = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState<VKCEntity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getHistoricalPlacesItems(1, 50);
                if (response.success) {
                    const data = Array.isArray(response.Data) ? response.Data : [response.Data];
                    setItems(data);
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
        return item._id?.$oid || '';
    };

    const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
            try {
                const response = await deleteHistoricalPlace(id);
                if (response.success) {
                    setItems(prev => prev.filter(item => getItemId(item) !== id));
                    alert('Historical place deleted successfully');
                } else {
                    alert(response.message || 'Failed to delete historical place');
                }
            } catch (err) {
                console.error('Delete error:', err);
                alert('An error occurred while deleting the historical place');
            }
        }
    };

    return (
        <div className="historical-place-dashboard">
            <header className="dashboard-header">
                <h2>Historical Places Management</h2>
                <button
                    className="add-btn"
                    onClick={() => navigate('/historical-place/add')}
                >
                    + Add New Place
                </button>
            </header>

            {loading ? (
                <div className="loading">Loading historical places...</div>
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
                                        <button
                                            className="edit-btn"
                                            onClick={() => navigate(`/historical-place/edit/${getItemId(item)}`)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDelete(getItemId(item), item.Title)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-data">No historical places found.</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default HistoricalPlaceDashboard;
