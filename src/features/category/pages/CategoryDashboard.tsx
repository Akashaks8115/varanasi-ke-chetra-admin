import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategoryItems, deleteCategory } from '../services/categoryApi';
import { VKCEntity } from '../../../types';
import './category-dashboard.css';

const CategoryDashboard = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState<VKCEntity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getCategoryItems();
                if (response.success) {
                    const data = Array.isArray(response.data) ? response.data : [response.data];
                    setItems(data.filter(Boolean));
                } else {
                    setError((response as any).message || 'Failed to fetch categories');
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
                const response = await deleteCategory(id);
                if (response.success) {
                    setItems(prev => prev.filter(item => getItemId(item) !== id));
                    alert('Category deleted successfully');
                } else {
                    alert((response as any).message || 'Failed to delete category');
                }
            } catch (err) {
                console.error('Delete error:', err);
                alert('An error occurred while deleting the category');
            }
        }
    };

    return (
        <div className="category-dashboard">
            <header className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Category Management</h2>
                <button className="add-btn" onClick={() => navigate('/category/add')}>
                    + Add New Category
                </button>
            </header>

            {loading ? (
                <div className="loading">Loading categories...</div>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : (
                <div className="items-grid">
                    {items.length > 0 ? (
                        items.slice((currentPage - 1) * 10, currentPage * 10).map((item) => (
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
                                    {item.CatId && <p className="cat-id">Cat ID: {item.CatId}</p>}
                                    <div className="card-actions">
                                        <button
                                            className="edit-btn"
                                            onClick={() => navigate(`/category/edit/${getItemId(item)}`)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDelete(getItemId(item), item.Title || 'Category')}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-data">No categories found.</div>
                    )}
                </div>
            )}
            {!loading && !error && items.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                    <span style={{ color: 'var(--text-sub)' }}>
                        Showing {items.slice((currentPage - 1) * 10, currentPage * 10).length} of {items.length} categories
                    </span>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            style={{ padding: '8px 16px', borderRadius: '4px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', border: '1px solid #e2e8f0', background: 'white' }}
                        >
                            Previous
                        </button>
                        <span style={{ fontWeight: 500 }}>Page {currentPage} of {Math.ceil(items.length / 10)}</span>
                        <button
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            disabled={currentPage >= Math.ceil(items.length / 10)}
                            style={{ padding: '8px 16px', borderRadius: '4px', cursor: currentPage >= Math.ceil(items.length / 10) ? 'not-allowed' : 'pointer', border: '1px solid #e2e8f0', background: 'white' }}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryDashboard;
