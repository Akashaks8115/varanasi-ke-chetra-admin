import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTemplesItems, deleteTemple } from '../services/templeApi';
import { VKCEntity } from '../../../types';
import './temple-dashboard.css';

const TempleDashboard = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState<VKCEntity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getTemplesItems(currentPage, 10, "", searchQuery);
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
    }, [searchQuery, currentPage]);

    const getItemId = (item: VKCEntity) => {
        if (typeof item._id === 'string') return item._id;
        return item._id?.$oid || '';
    };

    const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
            try {
                const response = await deleteTemple(id);
                if (response.success) {
                    setItems(prev => prev.filter(item => getItemId(item) !== id));
                    alert('Temple deleted successfully');
                } else {
                    alert(response.message || 'Failed to delete temple');
                }
            } catch (err) {
                console.error('Delete error:', err);
                alert('An error occurred while deleting the temple');
            }
        }
    };

    return (
        <div className="temple-dashboard">
            <header className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Temples Management</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input 
                        type="text" 
                        placeholder="Search temples..." 
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ccc' }}
                    />
                    <button className="add-btn" onClick={() => navigate('/temple/add')}>
                        + Add New Temple
                    </button>
                </div>
            </header>

            {loading ? (
                <div className="loading">Loading temples...</div>
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
                                            onClick={() => navigate(`/temple/edit/${getItemId(item)}`)}
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
                        <div className="no-data">No temples found.</div>
                    )}
                </div>
            )}
            {!loading && !error && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                    <button 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                        disabled={currentPage === 1}
                        style={{ padding: '8px 16px', borderRadius: '4px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                    >
                        Previous
                    </button>
                    <span>Page {currentPage}</span>
                    <button 
                        onClick={() => setCurrentPage(prev => prev + 1)} 
                        disabled={items.length < 10}
                        style={{ padding: '8px 16px', borderRadius: '4px', cursor: items.length < 10 ? 'not-allowed' : 'pointer' }}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default TempleDashboard;
