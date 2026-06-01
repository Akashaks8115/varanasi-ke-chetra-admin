import React, { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { getJyotirlingItems, insertJyotirling, updateJyotirling } from '../services/jyotirlingApi';
import './jyotirling-form.css';

const JyotirlingForm = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [previews, setPreviews] = useState<{ [key: string]: string }>({});

    const [formData, setFormData] = useState({
        Title: '',
        SubTitle: '',
        Description1: '',
        Description2: '',
        Description3: '',
        Location: '',
        Address: '',
        IsShow: 1
    });

    const fileInputRefs = {
        ProfileUrl: useRef<HTMLInputElement>(null),
        BannerUrl1: useRef<HTMLInputElement>(null),
        BannerUrl2: useRef<HTMLInputElement>(null)
    };

    React.useEffect(() => {
        if (id) {
            const fetchDetails = async () => {
                try {
                    const response = await getJyotirlingItems(1, 10, id);
                    if (response.success && response.Data && response.Data.length > 0) {
                        const data = response.Data[0];
                        setFormData({
                            Title: data.Title || '',
                            SubTitle: data.SubTitle || '',
                            Description1: data.Description1 || '',
                            Description2: data.Description2 || '',
                            Description3: data.Description3 || '',
                            Location: data.Location || '',
                            Address: data.Address || '',
                            IsShow: data.IsShow !== undefined ? data.IsShow : 1
                        });
                        setPreviews({
                            ProfileUrl: data.ProfileUrl || '',
                            BannerUrl1: data.BannerUrl1 || '',
                            BannerUrl2: data.BannerUrl2 || ''
                        });
                    }
                } catch (err) {
                    console.error("Failed to fetch Jyotirling details:", err);
                }
            };
            fetchDetails();
        }
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews(prev => ({ ...prev, [fieldName]: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = (fieldName: string) => {
        setPreviews(prev => {
            const newPreviews = { ...prev };
            delete newPreviews[fieldName];
            return newPreviews;
        });
        if (fileInputRefs[fieldName as keyof typeof fileInputRefs].current) {
            fileInputRefs[fieldName as keyof typeof fileInputRefs].current!.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                ProfileUrl: previews.ProfileUrl || '',
                BannerUrl1: previews.BannerUrl1 || '',
                BannerUrl2: previews.BannerUrl2 || ''
            };

            if (id) {
                await updateJyotirling(id, payload);
                alert('Jyotirling updated successfully');
            } else {
                await insertJyotirling(payload);
                alert('Jyotirling added successfully');
            }
            navigate('/jyotirling');
        } catch (err) {
            console.error("Failed to save Jyotirling:", err);
            alert('An error occurred while saving.');
        }
    };

    return (
        <div className="jyotirling-form-container">
            <header className="form-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={20} />
                </button>
                <h2>{id ? 'Edit Jyotirlinga' : 'Add New Jyotirlinga'}</h2>
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
                                    placeholder="Enter title (e.g. Somnath Mahadev)"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Sub Title</label>
                                <input
                                    type="text"
                                    name="SubTitle"
                                    value={formData.SubTitle}
                                    onChange={handleInputChange}
                                    placeholder="Enter short subtitle"
                                />
                            </div>
                        </div>

                        <div className="section">
                            <h3>Descriptions</h3>
                            <div className="form-group">
                                <label>Description 1</label>
                                <textarea
                                    name="Description1"
                                    value={formData.Description1}
                                    onChange={handleInputChange}
                                    placeholder="Primary description"
                                    rows={3}
                                />
                            </div>
                            <div className="form-group">
                                <label>Description 2</label>
                                <textarea
                                    name="Description2"
                                    value={formData.Description2}
                                    onChange={handleInputChange}
                                    placeholder="Secondary description"
                                    rows={3}
                                />
                            </div>
                            <div className="form-group">
                                <label>Description 3</label>
                                <textarea
                                    name="Description3"
                                    value={formData.Description3}
                                    onChange={handleInputChange}
                                    placeholder="Additional details"
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-right">
                        <div className="section">
                            <h3>Media Assets</h3>
                            <div className="image-pickers">
                                {Object.keys(fileInputRefs).map((field) => (
                                    <div key={field} className="image-picker-group">
                                        <label>{field.replace('Url', '').replace('1', ' 1').replace('2', ' 2')}</label>
                                        <div
                                            className="picker-box"
                                            onClick={() => fileInputRefs[field as keyof typeof fileInputRefs].current?.click()}
                                        >
                                            {previews[field] ? (
                                                <div className="preview-container">
                                                    <img src={previews[field]} alt="preview" />
                                                    <button
                                                        type="button"
                                                        className="remove-img"
                                                        onClick={(e) => { e.stopPropagation(); removeImage(field); }}
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="picker-placeholder">
                                                    <Upload size={24} />
                                                    <span>Select Image</span>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                hidden
                                                ref={fileInputRefs[field as keyof typeof fileInputRefs]}
                                                accept="image/*"
                                                onChange={(e) => handleFileChange(e, field)}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="section">
                            <h3>Location & Visibility</h3>
                            <div className="form-group">
                                <label>Google Maps Link</label>
                                <input
                                    type="text"
                                    name="Location"
                                    value={formData.Location}
                                    onChange={handleInputChange}
                                    placeholder="https://maps.app.goo.gl/..."
                                />
                            </div>
                            <div className="form-group">
                                <label>Physical Address</label>
                                <input
                                    type="text"
                                    name="Address"
                                    value={formData.Address}
                                    onChange={handleInputChange}
                                    placeholder="Enter full address"
                                />
                            </div>
                            <div className="form-group">
                                <label>Status</label>
                                <select name="IsShow" value={formData.IsShow} onChange={handleInputChange}>
                                    <option value={1}>Visible</option>
                                    <option value={0}>Hidden</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="form-footer">
                    <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>Cancel</button>
                    <button type="submit" className="submit-btn">Save Jyotirlinga</button>
                </div>
            </form>
        </div>
    );
};

export default JyotirlingForm;
