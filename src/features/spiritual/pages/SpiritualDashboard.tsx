import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSpiritualPackages } from '../services/spiritualApi';
import { SpiritualPackage } from '../../../types';
import './spiritual-dashboard.css';

const SpiritualDashboard = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState<SpiritualPackage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getSpiritualPackages('');
                if (response.success) {
                    setItems(response.data);
                } else {
                    setError(response.message);
                }
            } catch (err: any) {
                setError(`Failed to fetch spiritual packages. ${err?.message || ''}`);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="spiritual-dashboard">
            <header className="dashboard-header">
                <h2>Spiritual Journey Packages</h2>
                <button className="add-btn" onClick={() => navigate('/spiritual/add')}>
                    + Add New Package
                </button>
            </header>

            {loading ? (
                <div className="loading">Loading spiritual packages...</div>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : (
                <div className="packages-grid">
                    {items.length > 0 ? (
                        items.map((item) => (
                            <div key={item._id} className="package-card">
                                {/* Image */}
                                <div className="card-images">
                                    <img
                                        src={item.images?.[0] || ''}
                                        alt={item.title}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/360x200?text=No+Image';
                                        }}
                                    />
                                    {item.images?.length > 1 && (
                                        <span className="image-count-badge">+{item.images.length - 1} more</span>
                                    )}
                                </div>

                                <div className="card-body">
                                    <h3>{item.title}</h3>
                                    <p className="card-subtitle">{item.subtitle}</p>

                                    {/* Meta chips */}
                                    <div className="card-meta">
                                        {item.city && <span className="meta-chip city">📍 {item.city}</span>}
                                        {item.duration && <span className="meta-chip duration">🕐 {item.duration}</span>}
                                        {item.contactNumber && <span className="meta-chip contact">📞 {item.contactNumber}</span>}
                                    </div>

                                    {/* Places */}
                                    {item.places && item.places.length > 0 && (
                                        <div className="places-list">
                                            {item.places.map((place, i) => (
                                                <span key={i} className="place-tag">{place}</span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="card-actions">
                                        <button className="edit-btn">Edit</button>
                                        <button className="delete-btn">Delete</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-data">No spiritual packages found.</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SpiritualDashboard;
