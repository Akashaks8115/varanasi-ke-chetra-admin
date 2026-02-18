import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTransportVehicles } from '../services/transportApi';
import { TransportVehicle } from '../../../types';
import './transport-dashboard.css';

const TransportDashboard = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState<TransportVehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getTransportVehicles('');
                if (response.success) {
                    setItems(response.data);
                } else {
                    setError(response.message);
                }
            } catch (err: any) {
                setError(`Failed to fetch transport vehicles. ${err?.message || ''}`);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="transport-dashboard">
            <header className="dashboard-header">
                <h2>Transport Service</h2>
                <button className="add-btn" onClick={() => navigate('/transport/add')}>
                    + Add New Vehicle
                </button>
            </header>

            {loading ? (
                <div className="loading">Loading vehicles...</div>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : (
                <div className="vehicles-grid">
                    {items.length > 0 ? (
                        items.map((item) => (
                            <div key={item._id} className="vehicle-card">
                                {/* Vehicle image */}
                                <div className="vehicle-image">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x160?text=No+Image';
                                        }}
                                    />
                                </div>

                                <div className="vehicle-body">
                                    <h3>{item.title}</h3>
                                    <p className="vehicle-model">{item.model}{item.category ? ` • ${item.category}` : ''}</p>

                                    {/* Chips */}
                                    <div className="vehicle-chips">
                                        <span className="chip seats">🪑 {item.seats} Seats</span>
                                        {item.vehicleType && <span className="chip type">{item.vehicleType}</span>}
                                        {item.baggage && <span className="chip baggage">🧳 {item.baggage}</span>}
                                        {item.safety && <span className="chip safety">🛡️ {item.safety}</span>}
                                    </div>

                                    {/* Description */}
                                    {item.description && (
                                        <p className="vehicle-description">{item.description}</p>
                                    )}

                                    {/* In-cab features */}
                                    {item.inCabFeatures && item.inCabFeatures.length > 0 && (
                                        <div className="incab-features">
                                            {item.inCabFeatures.map((f, i) => (
                                                <span key={i} className="feature-tag">{f}</span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Contact */}
                                    {item.contactNumber && (
                                        <div className="contact-row">📞 {item.contactNumber}</div>
                                    )}

                                    <div className="card-actions">
                                        <button className="edit-btn">Edit</button>
                                        <button className="delete-btn">Delete</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-data">No vehicles found.</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TransportDashboard;
