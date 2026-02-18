import React, { useState, useRef } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';
import { uploadImage } from '../../services/uploadApi';
import './image-upload.css';

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    label?: string;
    id?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, label, id }) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Reset error
        setError(null);
        setUploading(true);

        try {
            const result = await uploadImage(file);
            if (result.success) {
                onChange(result.url); // Use result.url which is always string in type
            } else {
                setError(result.message || 'Upload failed');
            }
        } catch (err: any) {
            setError(err.message || 'Error uploading image');
            console.error('Upload error:', err);
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const removeImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange('');
    };

    return (
        <div className="image-upload-wrapper">
            {label && <label className="form-label" htmlFor={id}>{label}</label>}
            <div
                className={`image-upload-dropzone ${uploading ? 'uploading' : ''}`}
                onClick={() => !uploading && fileInputRef.current?.click()}
            >
                {value ? (
                    <>
                        <img src={value} alt="Preview" className="upload-preview" />
                        {!uploading && (
                            <button type="button" className="remove-btn" onClick={removeImage}>
                                <X size={16} />
                            </button>
                        )}
                    </>
                ) : uploading ? (
                    <div className="upload-loading">
                        <div className="spinner"></div>
                        <span className="upload-text">Uploading...</span>
                    </div>
                ) : (
                    <>
                        <Upload className="upload-icon" size={32} />
                        <span className="upload-text">Click to upload image</span>
                    </>
                )}

                <input
                    type="file"
                    id={id}
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/*"
                />
            </div>
            {error && <p className="error-text">{error}</p>}
        </div>
    );
};

export default ImageUpload;
