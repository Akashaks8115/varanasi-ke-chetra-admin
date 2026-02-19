import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { VKCEntity } from '../../../types';
import { getGhatsItems, deleteGhat } from '../../ghat/services/ghatApi';
import './data-dashboard.css';

const DataDashboard = () => {
    const { category } = useParams<{ category: string }>();
    const navigate = useNavigate();
    const [items, setItems] = useState<VKCEntity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                if (category === 'ghat') {
                    const response = await getGhatsItems(1, 100);
                    if (response.success) {
                        const data = Array.isArray(response.Data) ? response.Data : [response.Data];
                        setItems(data);
                    } else {
                        setError(response.message || 'Failed to fetch data.');
                    }
                } else {
                    // Future implementation for other categories
                    setItems([]);
                }
            } catch (err) {
                setError('Failed to fetch data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [category]);

    const getItemId = (item: VKCEntity) => {
        if (typeof item._id === 'string') return item._id;
        return item._id?.$oid || '';
    };

    const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
            try {
                let success = false;
                if (category === 'ghat') {
                    const response = await deleteGhat(id);
                    success = response.success;
                }

                if (success) {
                    setItems(prev => prev.filter(item => getItemId(item) !== id));
                    alert('Deleted successfully');
                } else {
                    alert('Failed to delete');
                }
            } catch (err) {
                console.error('Delete error:', err);
                alert('An error occurred while deleting');
            }
        }
    };

    return (
        <div className="data-dashboard">
            <header className="dashboard-header">
                <h2>{category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Data'}</h2>
                <button
                    className="add-btn"
                    onClick={() => navigate(`/${category}/add`)}
                >
                    + Add New
                </button>
            </header>

            {loading ? (
                <div className="loading">Loading data...</div>
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
                                            onClick={() => navigate(`/${category}/edit/${getItemId(item)}`)}
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
                        <div className="no-data">No data found for this category.</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DataDashboard;
