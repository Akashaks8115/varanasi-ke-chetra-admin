import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X, Loader2 } from 'lucide-react';
import { uploadImage } from '../../../services/uploadApi';
import { insertGhat } from '../services/ghatApi';
import './ghat-form.css';

const GhatForm = () => {
    const navigate = useNavigate();
    const [previews, setPreviews] = useState<{ [key: string]: string }>({});
    const [files, setFiles] = useState<{ [key: string]: File }>({});
    const [loading, setLoading] = useState(false);

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
        const file = e.target.files?.[0];
        if (file) {
            setFiles(prev => ({ ...prev, [fieldName]: file }));
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
        setFiles(prev => {
            const newFiles = { ...prev };
            delete newFiles[fieldName];
            return newFiles;
        });
        if (fileInputRefs[fieldName as keyof typeof fileInputRefs].current) {
            fileInputRefs[fieldName as keyof typeof fileInputRefs].current!.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const finalData = { ...formData } as any;

            // 1. Upload images first
            for (const field of ['ProfileUrl', 'BannerUrl1', 'BannerUrl2']) {
                const file = files[field];
                if (file) {
                    const uploadRes = await uploadImage(file, `Varanasi Ke Chetra/Ghat/${formData.Title}`);
                    if (uploadRes.success) {
                        finalData[field] = uploadRes.imageUrl;
                    } else {
                        throw new Error(`Failed to upload ${field}`);
                    }
                }
            }

            // 2. Insert Ghat
            const response = await insertGhat(finalData);

            if (response.success) {
                alert('Ghat added successfully!');
                navigate('/ghat');
            } else {
                alert(response.message || 'Failed to add Ghat');
            }
        } catch (error: any) {
            console.error('Submit error:', error);
            alert(error.message || 'An error occurred while saving the Ghat');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ghat-form-container">
            <header className="form-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={20} />
                </button>
                <h2>Add New Ghat</h2>
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
                                    placeholder="Enter ghat title (e.g. Manikarnika Ghat)"
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
                    <button type="button" className="cancel-btn" onClick={() => navigate(-1)} disabled={loading}>Cancel</button>
                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Saving...
                            </>
                        ) : 'Save Ghat'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default GhatForm;
