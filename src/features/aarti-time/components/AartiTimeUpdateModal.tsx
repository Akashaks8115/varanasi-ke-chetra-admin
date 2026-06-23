import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { AartiGhat, AartiSession } from '../../../types';
import { uploadImage } from '../../../services/uploadApi';
import { updateAartiTiming } from '../services/aartiTimeApi';
import './aarti-time-modal.css';

interface AartiTimeUpdateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    date: string;
    ghat: AartiGhat;
    session: AartiSession;
}

const AartiTimeUpdateModal: React.FC<AartiTimeUpdateModalProps> = ({ isOpen, onClose, onSuccess, date, ghat, session }) => {
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        ghatName: '',
        shortDescription: '',
        title: '',
        newTime: '',
        duration: '',
        specialNote: '',
        crowdStatus: ''
    });

    useEffect(() => {
        if (isOpen) {
            setFormData({
                ghatName: ghat.ghatName || '',
                shortDescription: ghat.shortDescription || '',
                title: session.title || '',
                newTime: session.calculatedAartiTime || '',
                duration: session.duration || '',
                specialNote: session.specialNote || '',
                crowdStatus: ghat.crowdStatus || ''
            });
            setImagePreview(ghat.ghatImage || null);
            setImageFile(null);
        }
    }, [isOpen, ghat, session]);

    if (!isOpen) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let uploadedImageUrl = ghat.ghatImage;

            if (imageFile) {
                const uploadRes = await uploadImage(imageFile, `Varanasi Ke Chetra/Aarti/${ghat.ghatName}`);
                if (uploadRes.success && uploadRes.imageUrl) {
                    uploadedImageUrl = uploadRes.imageUrl;
                } else {
                    throw new Error('Failed to upload image');
                }
            }

            const updatePayload = {
                ghatId: ghat.ghatId,
                sessionId: session.sessionId,
                ghatName: formData.ghatName,
                ghatImage: uploadedImageUrl,
                shortDescription: formData.shortDescription,
                title: formData.title,
                newTime: formData.newTime,
                duration: formData.duration,
                specialNote: formData.specialNote,
                crowdStatus: formData.crowdStatus
            };

            const response = await updateAartiTiming(date, updatePayload);
            
            if (response.success || response.status === 'Success') {
                alert('Aarti timing updated successfully!');
                onSuccess();
                onClose();
            } else {
                throw new Error(response.message || 'Failed to update');
            }
        } catch (error: any) {
            console.error('Update error:', error);
            alert(error.message || 'An error occurred while updating');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Update Aarti Timing</h2>
                    <button className="close-btn" onClick={onClose}><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-section">
                        <h3>Ghat Details</h3>
                        <div className="form-group">
                            <label>Ghat Name</label>
                            <input type="text" name="ghatName" value={formData.ghatName} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group">
                            <label>Short Description</label>
                            <textarea name="shortDescription" value={formData.shortDescription} onChange={handleInputChange} rows={2} required />
                        </div>
                        <div className="form-group">
                            <label>Crowd Status</label>
                            <select name="crowdStatus" value={formData.crowdStatus} onChange={handleInputChange} required>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Very High">Very High</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Ghat Image</label>
                            <div className="image-picker-box" onClick={() => fileInputRef.current?.click()}>
                                {imagePreview ? (
                                    <div className="preview-container">
                                        <img src={imagePreview} alt="preview" />
                                        <button type="button" className="remove-img" onClick={handleRemoveImage}>
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

                    <div className="form-section">
                        <h3>Session Details ({session.type})</h3>
                        <div className="form-group">
                            <label>Aarti Title</label>
                            <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>New Time (e.g., 08:00 PM)</label>
                                <input type="text" name="newTime" value={formData.newTime} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>Duration (e.g., 45 Mins)</label>
                                <input type="text" name="duration" value={formData.duration} onChange={handleInputChange} required />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Special Note</label>
                            <textarea name="specialNote" value={formData.specialNote} onChange={handleInputChange} rows={2} />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="cancel-btn" onClick={onClose} disabled={loading}>Cancel</button>
                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? <><Loader2 size={16} className="animate-spin" style={{marginRight: 6}} /> Updating...</> : 'Update Timing'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AartiTimeUpdateModal;
