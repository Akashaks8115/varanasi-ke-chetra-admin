import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getBanners, insertBanner, updateBanner } from '../services/bannerApi';
import { Banner } from '../../../types';
import ImageUpload from '../../../components/ImageUpload/ImageUpload';
import './banner-form.css';

const BannerForm = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEdit = Boolean(id);

    const [formData, setFormData] = useState<Banner>({
        title: '',
        subtitle: '',
        imageUrl: '',
        redirectUrl: '',
        isActive: true
    });
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEdit);

    useEffect(() => {
        if (isEdit && id) {
            const fetchBanner = async () => {
                try {
                    const response = await getBanners();
                    if (response.success) {
                        const dataRaw = (response as any).Data || response.data;
                        const allBanners = Array.isArray(dataRaw) ? dataRaw : (dataRaw ? [dataRaw] : []);
                        const banner = allBanners.find(b => {
                            const bId = typeof b._id === 'string' ? b._id : b._id?.$oid;
                            return bId === id;
                        });
                        if (banner) {
                            setFormData(banner);
                        } else {
                            alert('Banner not found');
                            navigate('/banner');
                        }
                    }
                } catch (err) {
                    console.error('Fetch error:', err);
                } finally {
                    setFetching(false);
                }
            };
            fetchBanner();
        }
    }, [id, isEdit, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            let response;
            if (isEdit && id) {
                response = await updateBanner({ ...formData, id });
            } else {
                response = await insertBanner(formData);
            }

            if (response.success) {
                alert(`Banner ${isEdit ? 'updated' : 'inserted'} successfully`);
                navigate('/banner');
            } else {
                alert(response.success === false ? 'Failed to save banner' : 'Error saving banner');
            }
        } catch (err) {
            console.error('Submit error:', err);
            alert('An error occurred while saving the banner');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    if (fetching) return <div className="loading">Loading banner data...</div>;

    return (
        <div className="banner-form-container">
            <header className="form-header">
                <h2>{isEdit ? 'Edit Banner' : 'Add New Banner'}</h2>
                <button className="back-btn" onClick={() => navigate('/banner')}>Back</button>
            </header>

            <form onSubmit={handleSubmit} className="banner-form">
                <div className="form-group">
                    <label>Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        placeholder="Banner Title"
                    />
                </div>

                <div className="form-group">
                    <label>Subtitle</label>
                    <input
                        type="text"
                        name="subtitle"
                        value={formData.subtitle}
                        onChange={handleChange}
                        required
                        placeholder="Banner Subtitle"
                    />
                </div>

                <div className="form-group">
                    <ImageUpload
                        label="Banner Image"
                        value={formData.imageUrl}
                        onChange={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
                    />
                </div>

                <div className="form-group">
                    <label>Redirect URL</label>
                    <input
                        type="text"
                        name="redirectUrl"
                        value={formData.redirectUrl}
                        onChange={handleChange}
                        required
                        placeholder="/ghats or https://link.com"
                    />
                </div>

                <div className="form-group checkbox">
                    <label>
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleChange}
                        />
                        Is Active
                    </label>
                </div>

                <div className="form-actions">
                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Saving...' : (isEdit ? 'Update Banner' : 'Insert Banner')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BannerForm;
