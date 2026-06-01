import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { getActivityById, insertActivity, updateActivity } from '../services/activityApi';
import './activity-form.css';

const ActivityForm = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [preview, setPreview] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        Title: '',
        Description: '',
        Location: '',
        Address: '',
        CatId: 1
    });

    useEffect(() => {
        if (id) {
            const fetchDetails = async () => {
                try {
                    const response = await getActivityById(id);
                    if (response.success && response.Data && response.Data.length > 0) {
                        const targetItem = response.Data[0];
                        setFormData({
                            Title: targetItem.Title || '',
                            Description: targetItem.Description || '',
                            Location: targetItem.Location || '',
                            Address: targetItem.Address || '',
                            CatId: targetItem.CatId || 1
                        });
                        setPreview(targetItem.ProfileUrl || '');
                    }
                } catch (err) {
                    console.error("Failed to fetch activity details:", err);
                }
            };
            fetchDetails();
        }
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'CatId' ? parseInt(value) || 1 : value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setPreview('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                ProfileUrl: preview || ''
            };

            if (id) {
                await updateActivity(id, payload);
                alert('Activity updated successfully');
            } else {
                await insertActivity(payload);
                alert('Activity added successfully');
            }
            navigate('/activity');
        } catch (err) {
            console.error("Failed to save activity:", err);
            alert('An error occurred while saving.');
        }
    };

    return (
        <div className="activity-form-container">
            <header className="form-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={20} />
                </button>
                <h2>{id ? 'Edit Activity' : 'Add New Activity'}</h2>
            </header>

            <form onSubmit={handleSubmit} className="modern-form">
                <div className="form-grid">
                    <div className="form-left">
                        <div className="section">
                            <h3>Basic Information</h3>
                            <div className="form-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    name="Title"
                                    value={formData.Title}
                                    onChange={handleInputChange}
                                    placeholder="Enter activity title"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    name="Description"
                                    value={formData.Description}
                                    onChange={handleInputChange}
                                    placeholder="Enter activity description"
                                    rows={4}
                                />
                            </div>
                            <div className="form-group">
                                <label>Location</label>
                                <input
                                    type="text"
                                    name="Location"
                                    value={formData.Location}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Dashashwamedh Ghat"
                                />
                            </div>
                            <div className="form-group">
                                <label>Address</label>
                                <input
                                    type="text"
                                    name="Address"
                                    value={formData.Address}
                                    onChange={handleInputChange}
                                    placeholder="Enter full address"
                                />
                            </div>
                            <div className="form-group">
                                <label>Category ID (CatId)</label>
                                <input
                                    type="number"
                                    name="CatId"
                                    value={formData.CatId}
                                    onChange={handleInputChange}
                                    placeholder="Enter numeric category ID"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-right">
                        <div className="section">
                            <h3>Activity Image</h3>
                            <div className="image-pickers">
                                <div className="image-picker-group">
                                    <label>Profile Image</label>
                                    <div
                                        className="picker-box"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        {preview ? (
                                            <div className="preview-container">
                                                <img src={preview} alt="preview" />
                                                <button type="button" className="remove-img" onClick={(e) => { e.stopPropagation(); removeImage(); }}>
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="picker-placeholder">
                                                <Upload size={24} />
                                                <span>Select Image</span>
                                            </div>
                                        )}
                                        <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={handleFileChange} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="form-footer">
                    <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>Cancel</button>
                    <button type="submit" className="submit-btn">Save Activity</button>
                </div>
            </form>
        </div>
    );
};

export default ActivityForm;
