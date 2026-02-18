import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X } from 'lucide-react';
import './our-services-form.css';

const OurServicesForm = () => {
    const navigate = useNavigate();
    const [iconPreview, setIconPreview] = useState<string>('');
    const iconInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        sId: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setIconPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Submitting Service Data:', formData);
        console.log('Icon:', iconPreview);
        alert('Service submitted successfully (Check console for data)');
        navigate('/our-services');
    };

    return (
        <div className="our-services-form-container">
            <header className="form-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={20} />
                </button>
                <h2>Add New Service</h2>
            </header>

            <form onSubmit={handleSubmit} className="modern-form">
                <div className="section">
                    <h3>Service Details</h3>

                    <div className="form-group">
                        <label>Service Icon</label>
                        <div className="icon-picker-wrap">
                            <div
                                className="icon-preview"
                                onClick={() => iconInputRef.current?.click()}
                            >
                                {iconPreview ? (
                                    <img src={iconPreview} alt="icon preview" />
                                ) : (
                                    <div className="icon-preview-placeholder">
                                        <Upload size={20} />
                                        <span>Icon</span>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    hidden
                                    ref={iconInputRef}
                                    accept="image/*"
                                    onChange={handleIconChange}
                                />
                            </div>
                            {iconPreview && (
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => { setIconPreview(''); if (iconInputRef.current) iconInputRef.current.value = ''; }}
                                >
                                    <X size={14} /> Remove
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Enter service title (e.g. Tour Guide)"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Subtitle</label>
                        <textarea
                            name="subtitle"
                            value={formData.subtitle}
                            onChange={handleInputChange}
                            placeholder="Enter short description"
                            rows={3}
                        />
                    </div>

                    <div className="form-group">
                        <label>Service ID (sId)</label>
                        <input
                            type="number"
                            name="sId"
                            value={formData.sId}
                            onChange={handleInputChange}
                            placeholder="Enter unique service ID (e.g. 1)"
                            required
                        />
                    </div>
                </div>

                <div className="form-footer">
                    <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>Cancel</button>
                    <button type="submit" className="submit-btn">Save Service</button>
                </div>
            </form>
        </div>
    );
};

export default OurServicesForm;
