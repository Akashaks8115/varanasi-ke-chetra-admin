import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X, Loader2 } from 'lucide-react';
import { uploadImage } from '../../../services/uploadApi';
import { getGhatsItems, insertGhat, updateGhat } from '../../ghat/services/ghatApi';
import './entity-form.css';

const EntityForm = () => {
    const { category, id } = useParams<{ category: string, id: string }>();
    const navigate = useNavigate();
    const [previews, setPreviews] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);

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

    const [files, setFiles] = useState<{ [key: string]: File }>({});

    useEffect(() => {
        if (id) {
            const fetchEntity = async () => {
                setFetching(true);
                try {
                    let data;
                    if (category === 'ghat') {
                        const response = await getGhatsItems(1, 1, id);
                        if (response.success) {
                            const responseData = Array.isArray(response.Data) ? response.Data : [response.Data];
                            if (responseData.length > 0) {
                                data = responseData[0];
                            }
                        }
                    }

                    if (data) {
                        setFormData({
                            Title: data.Title || '',
                            SubTitle: data.SubTitle || '',
                            Description1: data.Description1 || '',
                            Description2: data.Description2 || '',
                            Description3: data.Description3 || '',
                            Location: data.Location || '',
                            Address: data.Address || '',
                            IsShow: data.IsShow ?? 1
                        });
                        setPreviews({
                            ProfileUrl: data.ProfileUrl || '',
                            BannerUrl1: data.BannerUrl1 || '',
                            BannerUrl2: data.BannerUrl2 || ''
                        });
                    }
                } catch (err) {
                    console.error('Fetch error:', err);
                } finally {
                    setFetching(false);
                }
            };
            fetchEntity();
        }
    }, [id, category]);

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

            // 1. Upload new files if any
            for (const field of Object.keys(files)) {
                const file = files[field];
                const uploadRes = await uploadImage(file);
                if (uploadRes.success) {
                    finalData[field] = uploadRes.imageUrl;
                }
            }

            // 2. Add existing preview URLs if not replaced by new files
            for (const field of ['ProfileUrl', 'BannerUrl1', 'BannerUrl2']) {
                if (!files[field] && previews[field]) {
                    finalData[field] = previews[field];
                }
            }

            let success = false;
            let message = '';

            if (category === 'ghat') {
                if (id) {
                    const response = await updateGhat(id, finalData);
                    success = response.success;
                    message = response.message;
                } else {
                    const response = await insertGhat(finalData);
                    success = response.success;
                    message = response.message;
                }
            }

            if (success) {
                alert(message || 'Saved successfully');
                navigate(`/${category}`);
            } else {
                alert(message || 'Failed to save');
            }
        } catch (err) {
            console.error('Submit error:', err);
            alert('An error occurred while saving');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="entity-form-container">
            <header className="form-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={20} />
                </button>
                <h2>{id ? 'Edit' : 'Add New'} {category ? (category.charAt(0).toUpperCase() + category.slice(1)) : 'Item'}</h2>
            </header>

            {fetching ? (
                <div className="fetching-loader">
                    <Loader2 className="animate-spin" />
                    <span>Loading data...</span>
                </div>
            ) : (
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
                                        placeholder="Enter title (e.g. Manikarnika Ghat)"
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
                            ) : 'Save Content'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default EntityForm;
