import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActivityItems, getActivityByCatId, deleteActivity } from '../services/activityApi';
import { getCategoryItems } from '../../category/services/categoryApi';
import { VKCEntity } from '../../../types';
import './activity-dashboard.css';

const ActivityDashboard = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState<VKCEntity[]>([]);
    const [categories, setCategories] = useState<VKCEntity[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getCategoryItems();
                if (response.success && response.data) {
                    const data = Array.isArray(response.data) ? response.data : [response.data];
                    setCategories(data.filter(Boolean));
                }
            } catch (err) {
                console.error("Failed to fetch categories:", err);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = selectedCategory 
                    ? await getActivityByCatId(selectedCategory)
                    : await getActivityItems();

                if (response.success) {
                    let data = Array.isArray(response.Data) ? response.Data : [response.Data];
                    data = data.filter(Boolean);
                    if (searchQuery) {
                        data = data.filter(item => item.Title?.toLowerCase().includes(searchQuery.toLowerCase()));
                    }
                    setItems(data);
                } else {
                    setError((response as any).message || 'Failed to fetch activities');
                }
            } catch (err) {
                setError('Failed to fetch data. Please check if the API server is running.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [searchQuery, selectedCategory]);

    const getItemId = (item: VKCEntity) => {
        if (typeof item._id === 'string') return item._id;
        return item._id?.$oid || '';
    };

    const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
            try {
                const response = await deleteActivity(id);
                if (response.success) {
                    setItems(prev => prev.filter(item => getItemId(item) !== id));
                    alert('Activity deleted successfully');
                } else {
                    alert((response as any).message || 'Failed to delete activity');
                }
            } catch (err) {
                console.error('Delete error:', err);
                alert('An error occurred while deleting the activity');
            }
        }
    };

    return (
        <div className="activity-dashboard">
            <header className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Activity Management</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input 
                        type="text" 
                        placeholder="Search activities..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ccc' }}
                    />
                    <button className="add-btn" onClick={() => navigate('/activity/add')}>
                        + Add New Activity
                    </button>
                </div>
            </header>

            <div className="category-tabs" style={{ display: 'flex', gap: '10px', overflowX: 'auto', marginBottom: '20px', paddingBottom: '10px' }}>
                <button
                    onClick={() => setSelectedCategory(null)}
                    style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        border: 'none',
                        background: selectedCategory === null ? 'var(--primary)' : '#e2e8f0',
                        color: selectedCategory === null ? 'white' : '#475569',
                        fontWeight: 600,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                    }}
                >
                    All Activities
                </button>
                {categories.map(cat => (
                    <button
                        key={getItemId(cat)}
                        onClick={() => setSelectedCategory(cat.CatId as number)}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '20px',
                            border: 'none',
                            background: selectedCategory === cat.CatId ? 'var(--primary)' : '#e2e8f0',
                            color: selectedCategory === cat.CatId ? 'white' : '#475569',
                            fontWeight: 600,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {cat.Title}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="loading">Loading activities...</div>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : (
                <div className="items-grid">
                    {items.length > 0 ? (
                        items.map((item) => (
                            <div key={getItemId(item)} className="item-card">
                                <div className="card-image">
                                    <img src={item.ProfileUrl} alt={item.Title} onError={(e) => {
                                        (e.target as HTMLImageElement).src = '/no-image.svg';
                                    }} />
                                </div>
                                <div className="card-content">
                                    <h3>{item.Title}</h3>
                                    <p className="subtitle">{item.Description}</p>
                                    {item.Location && <p className="location">📍 {item.Location}</p>}
                                    <div className="card-actions">
                                        <button
                                            className="edit-btn"
                                            onClick={() => navigate(`/activity/edit/${getItemId(item)}`)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDelete(getItemId(item), item.Title || 'Activity')}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-data">No activities found.</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ActivityDashboard;
