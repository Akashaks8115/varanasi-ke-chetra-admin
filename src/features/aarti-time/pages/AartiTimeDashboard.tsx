import React, { useEffect, useState } from 'react';
import { getAartiTimings } from '../services/aartiTimeApi';
import { AartiTimingData, AartiGhat, AartiSession } from '../../../types';
import { MapPin, Edit2 } from 'lucide-react';
import AartiTimeUpdateModal from '../components/AartiTimeUpdateModal';
import './aarti-time.css';

const AartiTimeDashboard = () => {
    const [data, setData] = useState<AartiTimingData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGhat, setSelectedGhat] = useState<AartiGhat | null>(null);
    const [selectedSession, setSelectedSession] = useState<AartiSession | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAartiTimings();
            if (response.success) {
                setData(response.data);
            } else {
                setError('Failed to fetch aarti timings data.');
            }
        } catch (err) {
            setError('Failed to fetch data. Please check if the API server is running.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openEditModal = (ghat: AartiGhat, session: AartiSession) => {
        setSelectedGhat(ghat);
        setSelectedSession(session);
        setIsModalOpen(true);
    };

    return (
        <div className="aarti-dashboard">
            <header className="dashboard-header">
                <h2>Aarti Timings</h2>
                {data && <p>Date: {data.date}</p>}
            </header>

            {loading ? (
                <div className="loading">Loading aarti timings...</div>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : data && data.ghatsData ? (
                <div className="ghats-grid">
                    {data.ghatsData.map((ghat) => (
                        <div key={ghat._id} className="ghat-card">
                            <div className="ghat-image">
                                <img src={ghat.ghatImage} alt={ghat.ghatName} onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/no-image.svg';
                                }} />
                                <div className="crowd-badge" data-status={ghat.crowdStatus?.trim().toLowerCase()}>
                                    Crowd: {ghat.crowdStatus}
                                </div>
                            </div>
                            <div className="ghat-content">
                                <h3>{ghat.ghatName}</h3>
                                <p className="description">{ghat.shortDescription}</p>
                                <a href={ghat.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="maps-link">
                                    <MapPin size={16} color="#E91E63" strokeWidth={2.5} />
                                    <span>View on Maps</span>
                                </a>
                                
                                <div className="sessions-list">
                                    <h4>Sessions</h4>
                                    {ghat.sessions.map(session => (
                                        <div key={session._id} className="session-item">
                                            <div className="session-header">
                                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                    <span className="session-type">{session.type}</span>
                                                    <button className="edit-session-btn" onClick={() => openEditModal(ghat, session)}>
                                                        <Edit2 size={12} />
                                                        <span>Edit</span>
                                                    </button>
                                                </div>
                                                <span className="session-time">{session.calculatedAartiTime} ({session.duration})</span>
                                            </div>
                                            <div className="session-title">{session.title}</div>
                                            <div className="session-note">{session.specialNote}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-data">No aarti timings available.</div>
            )}
            
            {isModalOpen && selectedGhat && selectedSession && data && (
                <AartiTimeUpdateModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={fetchData}
                    date={data.date}
                    ghat={selectedGhat}
                    session={selectedSession}
                />
            )}
        </div>
    );
};

export default AartiTimeDashboard;
