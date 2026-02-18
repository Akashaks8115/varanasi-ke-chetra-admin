import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getServices } from '../services/ourServicesApi';
import { OurService } from '../../../types';
import './our-services-dashboard.css';

const OurServicesDashboard = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState<OurService[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Map sId → internal route (add more as features are built)
    const serviceRoutes: Record<number, string> = {
        1: '/spiritual',    // Spiritual Journey
        2: '/transport',    // Transport Service
        5: '/flights',      // Flight Ticket Enquiries
        6: '/visa',         // Visa Assistance Enquiries
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getServices();
                if (response.success) {
                    const sorted = [...response.data].sort((a, b) => a.sId - b.sId);
                    setItems(sorted);
                } else {
                    setError(response.message);
                }
            } catch (err) {
                setError('Failed to fetch services. Please check if the API server is running.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="our-services-dashboard">
            <header className="dashboard-header">
                <h2>Our Services Management</h2>
                <button className="add-btn" onClick={() => navigate('/our-services/add')}>
                    + Add New Service
                </button>
            </header>

            {loading ? (
                <div className="loading">Loading services...</div>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : (
                <div className="services-grid">
                    {items.length > 0 ? (
                        items.map((item) => {
                            const linkedRoute = serviceRoutes[item.sId];
                            return (
                                <div
                                    key={item._id}
                                    className={`service-card${linkedRoute ? ' clickable' : ''}`}
                                    onClick={() => linkedRoute && navigate(linkedRoute)}
                                >
                                    <div className="service-icon-wrap">
                                        <img
                                            src={item.icon}
                                            alt={item.title}
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40?text=?';
                                            }}
                                        />
                                    </div>
                                    <div className="service-info">
                                        <h3>{item.title}</h3>
                                        <p>{item.subtitle}</p>
                                        <div className="service-meta">
                                            <span className="service-sid">ID: {item.sId}</span>
                                            {linkedRoute && <span className="view-link">View →</span>}
                                        </div>
                                    </div>
                                    <div className="card-actions" onClick={e => e.stopPropagation()}>
                                        <button className="edit-btn">Edit</button>
                                        <button className="delete-btn">Delete</button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="no-data">No services found.</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default OurServicesDashboard;
