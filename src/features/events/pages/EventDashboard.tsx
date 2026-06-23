import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEvents, deleteEvent } from '../services/eventApi';
import { Event } from '../../../types';
import './event-dashboard.css';

const EventDashboard = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log('Fetching events...');
            const response = await getEvents();
            console.log('Event API response:', response);
            if (response.success || response.data) {
                const dataRaw = (response as any).Data || response.data;
                console.log('Extracted event data:', dataRaw);
                const data = Array.isArray(dataRaw) ? dataRaw : (dataRaw ? [dataRaw] : []);
                setEvents(data);
            } else {
                setError('Failed to fetch events: ' + (response as any).message);
            }
        } catch (err: any) {
            setError('Failed to fetch events: ' + err.message);
            console.error('Event fetch error detail:', err);
        } finally {
            setLoading(false);
        }
    };

    const getEventId = (event: Event) => {
        if (typeof event._id === 'string') return event._id;
        return (event._id as any)?.$oid || '';
    };

    const handleDelete = async (event: Event) => {
        const id = getEventId(event);
        if (window.confirm(`Are you sure you want to delete event "${event.title}"?`)) {
            try {
                const response = await deleteEvent(id);
                // Assume success if no error or if API format is known
                setEvents(prev => prev.filter(e => getEventId(e) !== id));
                alert('Event deleted successfully');
            } catch (err) {
                console.error('Delete error:', err);
                alert('An error occurred while deleting the event');
            }
        }
    };

    return (
        <div className="event-dashboard">
            <header className="dashboard-header">
                <h2>Events Management</h2>
                <button
                    className="add-btn"
                    onClick={() => navigate('/events/add')}
                >
                    + Add New Event
                </button>
            </header>

            {loading ? (
                <div className="loading">Loading events...</div>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : (
                <div className="events-grid">
                    {events.length > 0 ? (
                        events.map((event) => (
                            <div key={getEventId(event)} className="event-card">
                                <div className="card-image">
                                    <img src={event.eventImage} alt={event.title} onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400?text=No+Event+Image';
                                    }} />
                                    <div className="category-badge">
                                        {event.category}
                                    </div>
                                </div>
                                <div className="card-content">
                                    <h3>{event.title}</h3>
                                    <p className="subtitle">{event.subtitle}</p>
                                    <p className="detail">📅 {event.dates.startDate} - {event.dates.endDate}</p>
                                    <p className="detail">📍 {event.venue.name}</p>
                                    <div className="card-actions">
                                        <button
                                            className="edit-btn"
                                            onClick={() => navigate(`/events/edit/${getEventId(event)}`)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDelete(event)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-data">No events found.</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default EventDashboard;
