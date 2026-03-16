import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBanners, deleteBanner } from '../services/bannerApi';
import { Banner } from '../../../types';
import './banner-dashboard.css';

const BannerDashboard = () => {
    const navigate = useNavigate();
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log('Fetching banners...');
            const response = await getBanners();
            console.log('Banner API response:', response);
            if (response.success) {
                const dataRaw = (response as any).Data || response.data;
                console.log('Extracted banner data:', dataRaw);
                const data = Array.isArray(dataRaw) ? dataRaw : (dataRaw ? [dataRaw] : []);
                setBanners(data);
            } else {
                setError('Failed to fetch banners: ' + (response as any).message);
            }
        } catch (err: any) {
            setError('Failed to fetch banners: ' + err.message);
            console.error('Banner fetch error detail:', err);
        } finally {
            setLoading(false);
        }
    };

    const getBannerId = (banner: Banner) => {
        if (typeof banner._id === 'string') return banner._id;
        return (banner._id as any)?.$oid || '';
    };

    const handleDelete = async (banner: Banner) => {
        const id = getBannerId(banner);
        if (window.confirm(`Are you sure you want to delete banner "${banner.title}"?`)) {
            try {
                const response = await deleteBanner(id);
                if (response.success) {
                    setBanners(prev => prev.filter(b => getBannerId(b) !== id));
                    alert('Banner deleted successfully');
                } else {
                    alert('Failed to delete banner');
                }
            } catch (err) {
                console.error('Delete error:', err);
                alert('An error occurred while deleting the banner');
            }
        }
    };

    return (
        <div className="banner-dashboard">
            <header className="dashboard-header">
                <h2>Banners Management</h2>
                <button
                    className="add-btn"
                    onClick={() => navigate('/banner/add')}
                >
                    + Add New Banner
                </button>
            </header>

            {loading ? (
                <div className="loading">Loading banners...</div>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : (
                <div className="banners-grid">
                    {banners.length > 0 ? (
                        banners.map((banner) => (
                            <div key={getBannerId(banner)} className="banner-card">
                                <div className="card-image">
                                    <img src={banner.imageUrl} alt={banner.title} onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x200?text=No+Banner+Image';
                                    }} />
                                    <div className={`status-badge ${banner.isActive ? 'active' : 'inactive'}`}>
                                        {banner.isActive ? 'Active' : 'Inactive'}
                                    </div>
                                </div>
                                <div className="card-content">
                                    <h3>{banner.title}</h3>
                                    <p className="subtitle">{banner.subtitle}</p>
                                    <p className="redirect">🔗 {banner.redirectUrl}</p>
                                    <div className="card-actions">
                                        <button
                                            className="edit-btn"
                                            onClick={() => navigate(`/banner/edit/${getBannerId(banner)}`)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDelete(banner)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-data">No banners found.</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BannerDashboard;
