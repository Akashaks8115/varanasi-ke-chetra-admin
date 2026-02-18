import http from './http';
import { ImageUploadResponse } from '../types';

export const uploadImage = async (file: File): Promise<ImageUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await http.post<ImageUploadResponse>('/api/upload/image', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

    // Ensure we handle the mapping if the server returns 'url' instead of 'imageUrl'
    if (response.data.success && response.data.url) {
        response.data.imageUrl = response.data.url;
    }

    return response.data;
};
