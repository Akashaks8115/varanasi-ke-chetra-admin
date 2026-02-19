import http from './http';
import { ENDPOINTS } from './endpoints';
import { ImageUploadResponse } from '../types';

export const uploadImage = async (file: File, folder?: string): Promise<ImageUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    if (folder) {
        formData.append('folder', folder);
    }

    const response = await http.post<ImageUploadResponse>(ENDPOINTS.UPLOAD_IMAGE, formData, {
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
