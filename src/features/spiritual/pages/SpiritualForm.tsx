import React, { useState, useRef, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, X } from 'lucide-react';
import ImageUpload from '../../../components/ImageUpload/ImageUpload';
import './spiritual-form.css';

const MAX_IMAGES = 3;

const SpiritualForm = () => {
    const navigate = useNavigate();
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [places, setPlaces] = useState<string[]>([]);
    const [includes, setIncludes] = useState<string[]>([]);
    const [placeInput, setPlaceInput] = useState('');
    const [includeInput, setIncludeInput] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        city: '',
        duration: '',
        contactNumber: ''
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (url: string, index: number) => {
        setImagePreviews(prev => {
            const next = [...prev];
            if (url) {
                next[index] = url;
            } else {
                next.splice(index, 1);
            }
            return next;
        });
    };

    const addTag = (type: 'places' | 'includes') => {
        if (type === 'places' && placeInput.trim()) {
            setPlaces(prev => [...prev, placeInput.trim()]);
            setPlaceInput('');
        } else if (type === 'includes' && includeInput.trim()) {
            setIncludes(prev => [...prev, includeInput.trim()]);
            setIncludeInput('');
        }
    };

    const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>, type: 'places' | 'includes') => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(type);
        }
    };

    const removeTag = (type: 'places' | 'includes', idx: number) => {
        if (type === 'places') setPlaces(prev => prev.filter((_, i) => i !== idx));
        else setIncludes(prev => prev.filter((_, i) => i !== idx));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Submitting Spiritual Package:', { ...formData, places, includes, images: imagePreviews });
        alert('Spiritual package submitted (Check console for data)');
        navigate('/spiritual');
    };

    return (
        <div className="spiritual-form-container">
            <header className="form-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={20} />
                </button>
                <h2>Add New Spiritual Package</h2>
            </header>

            <form onSubmit={handleSubmit} className="modern-form">
                {/* Basic Info */}
                <div className="section">
                    <h3>Basic Information</h3>
                    <div className="form-group">
                        <label>Title</label>
                        <input type="text" name="title" value={formData.title} onChange={handleInputChange}
                            placeholder="e.g. Varanasi Spiritual Journey" required />
                    </div>
                    <div className="form-group">
                        <label>Subtitle</label>
                        <input type="text" name="subtitle" value={formData.subtitle} onChange={handleInputChange}
                            placeholder="e.g. Darshan • Ganga Aarti • Temple Visits" />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>City</label>
                            <input type="text" name="city" value={formData.city} onChange={handleInputChange}
                                placeholder="e.g. Varanasi" />
                        </div>
                        <div className="form-group">
                            <label>Duration</label>
                            <input type="text" name="duration" value={formData.duration} onChange={handleInputChange}
                                placeholder="e.g. 2 Days / 1 Night" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Contact Number</label>
                        <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange}
                            placeholder="e.g. 7518406741" />
                    </div>
                </div>

                {/* Images */}
                <div className="section">
                    <h3>Images (up to {MAX_IMAGES})</h3>
                    <div className="images-grid-container">
                        {[...Array(MAX_IMAGES)].map((_, i) => (
                            <ImageUpload
                                key={i}
                                value={imagePreviews[i] || ''}
                                onChange={(url) => handleImageChange(url, i)}
                                label={`Image ${i + 1}`}
                                id={`image-${i}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Places */}
                <div className="section">
                    <h3>Places Covered</h3>
                    <div className="form-group">
                        <label>Add Places</label>
                        <div className="tag-input-wrap">
                            {places.map((p, i) => (
                                <span key={i} className="tag-chip">
                                    {p}
                                    <button type="button" onClick={() => removeTag('places', i)}><X size={12} /></button>
                                </span>
                            ))}
                            <input
                                className="tag-input-field"
                                value={placeInput}
                                onChange={e => setPlaceInput(e.target.value)}
                                onKeyDown={e => handleTagKeyDown(e, 'places')}
                                placeholder="Type and press Enter..."
                            />
                        </div>
                        <p className="tag-hint">Press Enter or comma to add a place</p>
                    </div>
                </div>

                {/* Includes */}
                <div className="section">
                    <h3>What's Included</h3>
                    <div className="form-group">
                        <label>Add Inclusions</label>
                        <div className="tag-input-wrap">
                            {includes.map((inc, i) => (
                                <span key={i} className="tag-chip">
                                    {inc}
                                    <button type="button" onClick={() => removeTag('includes', i)}><X size={12} /></button>
                                </span>
                            ))}
                            <input
                                className="tag-input-field"
                                value={includeInput}
                                onChange={e => setIncludeInput(e.target.value)}
                                onKeyDown={e => handleTagKeyDown(e, 'includes')}
                                placeholder="Type and press Enter..."
                            />
                        </div>
                        <p className="tag-hint">Press Enter or comma to add an inclusion</p>
                    </div>
                </div>

                <div className="form-footer">
                    <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>Cancel</button>
                    <button type="submit" className="submit-btn">Save Package</button>
                </div>
            </form>
        </div>
    );
};

export default SpiritualForm;
