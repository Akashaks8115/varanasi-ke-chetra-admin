import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPanchkroshiItems, deletePanchkroshi } from '../services/panchkroshiApi';
import { VKCEntity } from '../../../types';
import './panchkroshi-dashboard.css';

const PanchkroshiDashboard = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState<VKCEntity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getPanchkroshiItems(1, 50);
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
        return item._id.$oid;
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this place?')) {
            try {
                const response = await deletePanchkroshi(id);
                if (response.success) {
                    setItems(items.filter(item => getItemId(item) !== id));
                    alert('Place deleted successfully');
                } else {
                    alert('Failed to delete place');
                }
            } catch (err) {
                console.error(err);
                alert('An error occurred while deleting');
            }
        }
    };

    return (
        <div className="panchkroshi-dashboard">
            <header className="dashboard-header">
                <h2>Panchkroshi Places Management</h2>
                <button className="add-btn" onClick={() => navigate('/panchkroshi/add')}>
                    + Add New Place
                </button>
            </header>

            {loading ? (
                <div className="loading">Loading Panchkroshi places...</div>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : (
                <div className="items-grid">
                    {items.length > 0 ? (
                        items.map((item) => (
                            <div key={getItemId(item)} className="item-card">
                                <div className="card-image">
                                    <img
                                        src={item.ProfileUrl}
                                        alt={item.Title}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = '/no-image.svg';
                                        }}
                                    />
                                    <div className="status-badge" data-show={item.IsShow !== 0}>
                                        {item.IsShow !== 0 ? 'Visible' : 'Hidden'}
                                    </div>
                                </div>
                                <div className="card-content">
                                    <h3>{item.Title}</h3>
                                    {item.SubTitle && <p className="subtitle">{item.SubTitle}</p>}
                                    {item.Address && <p className="address">📍 {item.Address}</p>}
                                    <div className="card-actions">
                                        <button className="edit-btn" onClick={() => navigate(`/panchkroshi/edit/${getItemId(item)}`)}>Edit</button>
                                        <button className="delete-btn" onClick={() => handleDelete(getItemId(item))}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-data">No Panchkroshi places found.</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PanchkroshiDashboard;
