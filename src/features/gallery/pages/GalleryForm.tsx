import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { insertGallery, updateGallery } from '../services/galleryApi';
import { uploadImage } from '../../../services/uploadApi';
import { GalleryItem } from '../../../types';
import './gallery-form.css';

const GalleryForm = () => {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState<GalleryItem>({
        title: '',
        description: '',
        imageUrl: '',
        location: '',
        contributorName: '',
        contributorInsta: '',
        isActive: 1
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setUploadingImage(true);
            try {
                const response = await uploadImage(file, 'gallery');
                if (response.success) {
                    setFormData(prev => ({ ...prev, imageUrl: response.url || response.imageUrl || '' }));
                } else {
                    alert('Failed to upload image: ' + response.message);
                }
            } catch (err: any) {
                alert('Error uploading image: ' + err.message);
            } finally {
                setUploadingImage(false);
            }
        }
    };

    useEffect(() => {
        if (isEdit && location.state && location.state.item) {
            setFormData(location.state.item);
        }
    }, [isEdit, location]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isEdit && id) {
                await updateGallery(id, formData);
                alert('Gallery item updated successfully!');
            } else {
                await insertGallery(formData);
                alert('Gallery item added successfully!');
            }
            navigate('/gallery');
        } catch (err: any) {
            setError(err.message || 'An error occurred while saving.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="gallery-form-container">
            <header className="form-header">
                <h2>{isEdit ? 'Edit Gallery Image' : 'Add New Gallery Image'}</h2>
                <button className="back-btn" onClick={() => navigate('/gallery')}>
                    &larr; Back to Gallery
                </button>
            </header>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="gallery-form">
                <div className="form-group">
                    <label htmlFor="title">Title *</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                    />
                </div>

                <div className="form-group">
                    <label>Image Upload *</label>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploadingImage}
                        />
                        {uploadingImage && <span>Uploading...</span>}
                    </div>
                    <label htmlFor="imageUrl">Or Enter Image URL</label>
                    <input
                        type="url"
                        id="imageUrl"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        required
                    />
                    {formData.imageUrl && (
                        <div className="image-preview">
                            <img src={formData.imageUrl} alt="Preview" onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Invalid+URL';
                            }} />
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="location">Location *</label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="contributorName">Contributor Name</label>
                        <input
                            type="text"
                            id="contributorName"
                            name="contributorName"
                            value={formData.contributorName}
                            onChange={handleChange}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="contributorInsta">Contributor Instagram ID</label>
                        <input
                            type="text"
                            id="contributorInsta"
                            name="contributorInsta"
                            value={formData.contributorInsta}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                        type="checkbox"
                        id="isActive"
                        name="isActive"
                        checked={formData.isActive === 1}
                        onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked ? 1 : 0 }))}
                        style={{ width: 'auto', margin: 0 }}
                    />
                    <label htmlFor="isActive" style={{ margin: 0 }}>Is Active</label>
                </div>

                <div className="form-actions">
                    <button type="button" className="cancel-btn" onClick={() => navigate('/gallery')} disabled={loading}>
                        Cancel
                    </button>
                    <button type="submit" className="save-btn" disabled={loading}>
                        {loading ? 'Saving...' : (isEdit ? 'Update Image' : 'Add Image')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default GalleryForm;
