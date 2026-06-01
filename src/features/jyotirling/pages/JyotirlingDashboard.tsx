import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getJyotirlingItems, deleteJyotirling } from '../services/jyotirlingApi';
import { VKCEntity } from '../../../types';
import './jyotirling-dashboard.css';

const JyotirlingDashboard = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState<VKCEntity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getJyotirlingItems(1, 50);
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
        if (window.confirm('Are you sure you want to delete this Jyotirlinga?')) {
            try {
                const response = await deleteJyotirling(id);
                if (response.success) {
                    setItems(items.filter(item => getItemId(item) !== id));
                } else {
                    alert('Failed to delete: ' + response.message);
                }
            } catch (err) {
                alert('An error occurred while deleting.');
                console.error(err);
            }
        }
    };

    return (
        <div className="jyotirling-dashboard">
            <header className="dashboard-header">
                <h2>Jyotirlinga Management</h2>
                <button
                    className="add-btn"
                    onClick={() => navigate('/jyotirling/add')}
                >
                    + Add New Jyotirlinga
                </button>
            </header>

            {loading ? (
                <div className="loading">Loading Jyotirlingas...</div>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : (
                <div className="items-grid">
                    {items.length > 0 ? (
                        items.map((item) => (
                            <div key={getItemId(item)} className="item-card">
                                <div className="card-image">
                                    <img src={item.ProfileUrl || '/no-image.svg'} alt={item.Title} onError={(e) => {
                                        (e.target as HTMLImageElement).src = '/no-image.svg';
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
                                        <button className="edit-btn" onClick={() => navigate(`/jyotirling/edit/${getItemId(item)}`)}>Edit</button>
                                        <button className="delete-btn" onClick={() => handleDelete(getItemId(item))}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-data">No Jyotirlingas found.</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default JyotirlingDashboard;
