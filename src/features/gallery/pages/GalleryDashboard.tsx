import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGallery, deleteGallery } from '../services/galleryApi';
import { GalleryItem } from '../../../types';
import './gallery-dashboard.css';

const GalleryDashboard = () => {
    const navigate = useNavigate();
    const [images, setImages] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const limit = 10;
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchData(page, search);
    }, [page]);

    const fetchData = async (currentPage: number, currentSearch: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getGallery(currentPage, limit, currentSearch);
            if (response.success) {
                const dataRaw = response.data || response.images;
                const data = Array.isArray(dataRaw) ? dataRaw : (dataRaw ? [dataRaw] : []);
                setImages(data);
                if (response.totalItem !== undefined) {
                    setTotalPages(Math.max(1, Math.ceil(response.totalItem / limit)));
                } else if (response.totalPages) {
                    setTotalPages(response.totalPages);
                } else {
                    // Fallback logic if totalPages is missing
                    if (data.length < limit && currentPage === 1) setTotalPages(1);
                    else if (data.length === limit) setTotalPages(currentPage + 1);
                }
            } else {
                setError('Failed to fetch gallery: ' + response.message);
            }
        } catch (err: any) {
            setError('Failed to fetch gallery: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchData(1, search);
    };

    const getGalleryId = (item: GalleryItem) => {
        if (typeof item._id === 'string') return item._id;
        return (item._id as any)?.$oid || '';
    };

    const handleDelete = async (item: GalleryItem) => {
        const id = getGalleryId(item);
        if (window.confirm(`Are you sure you want to delete "${item.title}"?`)) {
            try {
                await deleteGallery(id);
                setImages(prev => prev.filter(e => getGalleryId(e) !== id));
                alert('Image deleted successfully');
            } catch (err) {
                console.error('Delete error:', err);
                alert('An error occurred while deleting the image');
            }
        }
    };

    return (
        <div className="gallery-dashboard">
            <header className="dashboard-header">
                <h2>Gallery Management</h2>
                <div className="header-actions">
                    <form onSubmit={handleSearch} className="search-form">
                        <input
                            type="text"
                            placeholder="Search images..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button type="submit" className="search-btn">Search</button>
                    </form>
                    <button
                        className="add-btn"
                        onClick={() => navigate('/gallery/add')}
                    >
                        + Add New Image
                    </button>
                </div>
            </header>

            {loading ? (
                <div className="loading">Loading gallery...</div>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : (
                <>
                    <div className="gallery-grid">
                        {images.length > 0 ? (
                            images.map((item) => (
                                <div key={getGalleryId(item)} className="gallery-card">
                                    <div className="card-image">
                                        <img src={item.imageUrl} alt={item.title} onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400?text=No+Image';
                                        }} />
                                    </div>
                                    <div className="card-content">
                                        <h3>{item.title}</h3>
                                        <p className="subtitle">{item.description}</p>
                                        <p className="detail">📍 {item.location}</p>
                                        <p className="detail">👤 {item.contributorName} ({item.contributorInsta})</p>
                                        <div className="card-actions">
                                            <button
                                                className="edit-btn"
                                                onClick={() => navigate(`/gallery/edit/${getGalleryId(item)}`, { state: { item } })}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="delete-btn"
                                                onClick={() => handleDelete(item)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-data">No images found.</div>
                        )}
                    </div>
                    
                    <div className="pagination">
                        <button 
                            disabled={page === 1} 
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                        >
                            Previous
                        </button>
                        <span>Page {page} of {totalPages}</span>
                        <button 
                            disabled={page >= totalPages} 
                            onClick={() => setPage(p => p + 1)}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default GalleryDashboard;
