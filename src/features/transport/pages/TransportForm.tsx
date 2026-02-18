import React, { useState, useRef, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, X } from 'lucide-react';
import ImageUpload from '../../../components/ImageUpload/ImageUpload';
import './transport-form.css';

const TransportForm = () => {
    const navigate = useNavigate();
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [inCabFeatures, setInCabFeatures] = useState<string[]>([]);
    const [featureInput, setFeatureInput] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        model: '',
        category: '',
        vehicleType: '',
        seats: '',
        baggage: '',
        safety: '',
        description: '',
        contactNumber: ''
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (url: string) => {
        setImagePreview(url);
    };

    const addFeature = () => {
        if (featureInput.trim()) {
            setInCabFeatures(prev => [...prev, featureInput.trim()]);
            setFeatureInput('');
        }
    };

    const handleFeatureKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addFeature();
        }
    };

    const removeFeature = (idx: number) => {
        setInCabFeatures(prev => prev.filter((_, i) => i !== idx));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Submitting Transport Vehicle:', { ...formData, inCabFeatures, image: imagePreview });
        alert('Vehicle submitted (Check console for data)');
        navigate('/transport');
    };

    return (
        <div className="transport-form-container">
            <header className="form-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={20} />
                </button>
                <h2>Add New Vehicle</h2>
            </header>

            <form onSubmit={handleSubmit} className="modern-form">
                {/* Basic Info */}
                <div className="section">
                    <h3>Vehicle Information</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Title</label>
                            <input type="text" name="title" value={formData.title} onChange={handleInputChange}
                                placeholder="e.g. Comfort MPV" required />
                        </div>
                        <div className="form-group">
                            <label>Model</label>
                            <input type="text" name="model" value={formData.model} onChange={handleInputChange}
                                placeholder="e.g. Ertiga" />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Category</label>
                            <input type="text" name="category" value={formData.category} onChange={handleInputChange}
                                placeholder="e.g. Family Cab" />
                        </div>
                        <div className="form-group">
                            <label>Vehicle Type</label>
                            <input type="text" name="vehicleType" value={formData.vehicleType} onChange={handleInputChange}
                                placeholder="e.g. MPV" />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Seats</label>
                            <input type="number" name="seats" value={formData.seats} onChange={handleInputChange}
                                placeholder="e.g. 6" min="1" />
                        </div>
                        <div className="form-group">
                            <label>Contact Number</label>
                            <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange}
                                placeholder="e.g. 7518406741" />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Baggage</label>
                            <input type="text" name="baggage" value={formData.baggage} onChange={handleInputChange}
                                placeholder="e.g. 3 Large Bags" />
                        </div>
                        <div className="form-group">
                            <label>Safety</label>
                            <input type="text" name="safety" value={formData.safety} onChange={handleInputChange}
                                placeholder="e.g. Dual Airbags" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea name="description" value={formData.description} onChange={handleInputChange}
                            placeholder="Brief description of the vehicle..." rows={3} />
                    </div>
                </div>

                {/* Image */}
                <div className="section">
                    <h3>Vehicle Image</h3>
                    <ImageUpload
                        value={imagePreview || ''}
                        onChange={handleImageChange}
                        id="vehicle-image-upload"
                    />
                </div>

                {/* In-Cab Features */}
                <div className="section">
                    <h3>In-Cab Features</h3>
                    <div className="form-group">
                        <label>Add Features</label>
                        <div className="tag-input-wrap">
                            {inCabFeatures.map((f, i) => (
                                <span key={i} className="tag-chip">
                                    {f}
                                    <button type="button" onClick={() => removeFeature(i)}><X size={12} /></button>
                                </span>
                            ))}
                            <input
                                className="tag-input-field"
                                value={featureInput}
                                onChange={e => setFeatureInput(e.target.value)}
                                onKeyDown={handleFeatureKeyDown}
                                placeholder="Type and press Enter..."
                            />
                        </div>
                        <p className="tag-hint">Press Enter or comma to add a feature</p>
                    </div>
                </div>

                <div className="form-footer">
                    <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>Cancel</button>
                    <button type="submit" className="submit-btn">Save Vehicle</button>
                </div>
            </form>
        </div>
    );
};

export default TransportForm;
