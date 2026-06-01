import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { getCategoryItems, insertCategory, updateCategory } from '../services/categoryApi';
import './category-form.css';

const CategoryForm = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [preview, setPreview] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        Title: '',
        SubTitle: '',
        CatId: 1,
        IsShow: 1
    });

    useEffect(() => {
        if (id) {
            const fetchDetails = async () => {
                try {
                    const response = await getCategoryItems();
                    if (response.success && response.data) {
                        const dataArray = Array.isArray(response.data) ? response.data : [response.data];
                        const targetItem = dataArray.find(item => {
                            const itemId = typeof item._id === 'string' ? item._id : item._id?.$oid;
                            return itemId === id;
                        });

                        if (targetItem) {
                            setFormData({
                                Title: targetItem.Title || '',
                                SubTitle: targetItem.SubTitle || '',
                                CatId: targetItem.CatId || 1,
                                IsShow: targetItem.IsShow !== undefined ? targetItem.IsShow : 1
                            });
                            setPreview(targetItem.ProfileUrl || '');
                        }
                    }
                } catch (err) {
                    console.error("Failed to fetch category details:", err);
                }
            };
            fetchDetails();
        }
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'CatId' ? parseInt(value) : value }));
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
                await updateCategory(id, payload);
                alert('Category updated successfully');
            } else {
                await insertCategory(payload);
                alert('Category added successfully');
            }
            navigate('/category');
        } catch (err) {
            console.error("Failed to save category:", err);
            alert('An error occurred while saving.');
        }
    };

    return (
        <div className="category-form-container">
            <header className="form-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={20} />
                </button>
                <h2>{id ? 'Edit Category' : 'Add New Category'}</h2>
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
                                    placeholder="Enter category title"
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
                                    placeholder="Enter category subtitle"
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
                            <div className="form-group">
                                <label>Status</label>
                                <select name="IsShow" value={formData.IsShow} onChange={handleInputChange}>
                                    <option value={1}>Visible</option>
                                    <option value={0}>Hidden</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-right">
                        <div className="section">
                            <h3>Category Image</h3>
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
                    <button type="submit" className="submit-btn">Save Category</button>
                </div>
            </form>
        </div>
    );
};

export default CategoryForm;
