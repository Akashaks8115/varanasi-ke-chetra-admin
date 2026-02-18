import React, { useState } from 'react';
import { Bell, Send, Loader2 } from 'lucide-react';
import ImageUpload from '../../../components/ImageUpload/ImageUpload';
import { sendNotification } from '../../../services/notificationApi';
import './notification-page.css';

const SendNotificationPage = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        body: '',
        image: '',
        id: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (url: string) => {
        setFormData(prev => ({ ...prev, image: url }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                title: formData.title,
                body: formData.body,
                image: formData.image,
                data: {
                    id: formData.id,
                    image: formData.image
                }
            };

            const response = await sendNotification(payload);
            if (response.success) {
                alert('Notification sent successfully!');
                setFormData({ title: '', body: '', image: '', id: '' });
            } else {
                alert(`Error: ${response.message}`);
            }
        } catch (err: any) {
            alert(`Failed to send notification: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="notification-page">
            <header className="page-header">
                <div className="header-title">
                    <Bell size={28} className="header-icon" />
                    <h2>Send Push Notification</h2>
                </div>
                <p className="header-subtitle">Broadcast messages to all users with images and links</p>
            </header>

            <div className="notification-container">
                <form onSubmit={handleSubmit} className="notification-form">
                    <div className="section">
                        <h3>Notification Details</h3>

                        <div className="form-group">
                            <label>Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="e.g. New Destination Found!"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Description (Body)</label>
                            <textarea
                                name="body"
                                value={formData.body}
                                onChange={handleInputChange}
                                placeholder="Describe the notification content..."
                                rows={4}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Target ID (Optional)</label>
                                <input
                                    type="text"
                                    name="id"
                                    value={formData.id}
                                    onChange={handleInputChange}
                                    placeholder="e.g. 123"
                                />
                                <p className="input-hint">Used for deep-linking to specific content</p>
                            </div>
                        </div>
                    </div>

                    <div className="section">
                        <h3>Hero Image</h3>
                        <div className="notification-upload-wrap">
                            <ImageUpload
                                value={formData.image}
                                onChange={handleImageChange}
                                label="Upload notification image"
                            />
                        </div>
                    </div>

                    <div className="form-footer">
                        <button
                            type="submit"
                            className="send-btn"
                            disabled={loading || !formData.title || !formData.body}
                        >
                            {loading ? (
                                <><Loader2 size={18} className="spin" /> Sending...</>
                            ) : (
                                <><Send size={18} /> Send Notification</>
                            )}
                        </button>
                    </div>
                </form>

                {/* Preview Card */}
                <div className="notification-preview">
                    <h3>Real-time Preview</h3>
                    <div className="mobile-preview">
                        <div className="mock-notification">
                            <div className="mock-header">
                                <div className="mock-app-icon">V</div>
                                <span className="mock-app-name">Varanasi Ke Kshetra</span>
                                <span className="mock-time">now</span>
                            </div>
                            <div className="mock-content">
                                <div className="mock-text">
                                    <div className="mock-title">{formData.title || 'Notification Title'}</div>
                                    <div className="mock-body">{formData.body || 'This is how your notification message will appear to users on their devices.'}</div>
                                </div>
                                {formData.image && (
                                    <div className="mock-image">
                                        <img src={formData.image} alt="Preview" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SendNotificationPage;
