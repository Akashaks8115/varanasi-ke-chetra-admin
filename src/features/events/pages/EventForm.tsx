import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getEvents, insertEvent, updateEvent } from '../services/eventApi';
import { Event } from '../../../types';
import ImageUpload from '../../../components/ImageUpload/ImageUpload';
import './event-form.css';

const EventForm = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEdit = Boolean(id);

    const [formData, setFormData] = useState<Event>({
        eventId: '',
        title: '',
        subtitle: '',
        eventImage: '',
        description: '',
        category: '',
        venue: {
            name: '',
            googleMapsUrl: ''
        },
        dates: {
            startDate: '',
            endDate: '',
            eventTiming: ''
        },
        entryType: '',
        boatBookingRequired: false,
        crowdAlert: '',
        tags: []
    });
    const [tagsInput, setTagsInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEdit);

    useEffect(() => {
        if (isEdit && id) {
            const fetchEvent = async () => {
                try {
                    const response = await getEvents();
                    if (response.success || response.data) {
                        const dataRaw = (response as any).Data || response.data;
                        const allEvents = Array.isArray(dataRaw) ? dataRaw : (dataRaw ? [dataRaw] : []);
                        const event = allEvents.find((e: any) => {
                            const eId = typeof e._id === 'string' ? e._id : e._id?.$oid;
                            return eId === id;
                        });
                        if (event) {
                            setFormData(event);
                            setTagsInput(event.tags ? event.tags.join(', ') : '');
                        } else {
                            alert('Event not found');
                            navigate('/events');
                        }
                    }
                } catch (err) {
                    console.error('Fetch error:', err);
                } finally {
                    setFetching(false);
                }
            };
            fetchEvent();
        }
    }, [id, isEdit, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Date validation
        const startDate = new Date(formData.dates.startDate);
        const endDate = new Date(formData.dates.endDate);
        if (endDate < startDate) {
            alert('End Date cannot be less than Start Date');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                ...formData,
                tags: tagsInput.split(',').map(t => t.trim()).filter(t => t)
            };

            let response;
            if (isEdit && id) {
                response = await updateEvent({ ...payload, id });
            } else {
                response = await insertEvent(payload);
            }

            // Assume success if no error thrown by API
            alert(`Event ${isEdit ? 'updated' : 'inserted'} successfully`);
            navigate('/events');
        } catch (err) {
            console.error('Submit error:', err);
            alert('An error occurred while saving the event');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData((prev: any) => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    if (fetching) return <div className="loading">Loading event data...</div>;

    return (
        <div className="event-form-container">
            <header className="form-header">
                <h2>{isEdit ? 'Edit Event' : 'Add New Event'}</h2>
                <button className="back-btn" onClick={() => navigate('/events')}>Back</button>
            </header>

            <form onSubmit={handleSubmit} className="event-form">
                <div className="form-row">
                    <div className="form-group">
                        <label>Event ID (unique)</label>
                        <input type="text" name="eventId" value={formData.eventId} onChange={handleChange} required placeholder="evt_dev_deepawali_2026" />
                    </div>
                    <div className="form-group">
                        <label>Category</label>
                        <input type="text" name="category" value={formData.category} onChange={handleChange} required placeholder="Festival" />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Title</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="Dev Deepawali 2026" />
                    </div>
                    <div className="form-group">
                        <label>Subtitle</label>
                        <input type="text" name="subtitle" value={formData.subtitle} onChange={handleChange} required placeholder="Kashi ki vishva-prasiddh Devon ki Diwali" />
                    </div>
                </div>

                <div className="form-group">
                    <ImageUpload 
                        label="Event Image" 
                        value={formData.eventImage} 
                        onChange={(url) => setFormData(prev => ({ ...prev, eventImage: url }))} 
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} required placeholder="Description..."></textarea>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Venue Name</label>
                        <input type="text" name="venue.name" value={formData.venue.name} onChange={handleChange} required placeholder="All Ghats of Varanasi" />
                    </div>
                    <div className="form-group">
                        <label>Venue Google Maps URL</label>
                        <input type="text" name="venue.googleMapsUrl" value={formData.venue.googleMapsUrl} onChange={handleChange} required placeholder="https://maps.app.goo.gl/..." />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Start Date</label>
                        <input type="date" name="dates.startDate" value={formData.dates.startDate} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>End Date</label>
                        <input type="date" name="dates.endDate" value={formData.dates.endDate} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Event Timing</label>
                        <input type="text" name="dates.eventTiming" value={formData.dates.eventTiming} onChange={handleChange} required placeholder="05:00 PM onwards" />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Entry Type</label>
                        <input type="text" name="entryType" value={formData.entryType} onChange={handleChange} required placeholder="Free" />
                    </div>
                    <div className="form-group">
                        <label>Crowd Alert</label>
                        <input type="text" name="crowdAlert" value={formData.crowdAlert} onChange={handleChange} required placeholder="Extremely High" />
                    </div>
                </div>

                <div className="form-group">
                    <label>Tags (Comma separated)</label>
                    <input type="text" name="tags" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="Mega Event, Festival, Lights" />
                </div>

                <div className="form-group checkbox">
                    <label>
                        <input type="checkbox" name="boatBookingRequired" checked={formData.boatBookingRequired} onChange={handleChange} />
                        Boat Booking Required
                    </label>
                </div>

                <div className="form-actions">
                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Saving...' : (isEdit ? 'Update Event' : 'Insert Event')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EventForm;
