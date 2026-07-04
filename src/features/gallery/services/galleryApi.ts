import http from '../../../services/http';
import { ENDPOINTS } from '../../../services/endpoints';
import { GalleryItem, GalleryApiResponse } from '../../../types';

export const getGallery = async (pageIndex: number = 1, pageSize: number = 10, title: string = ''): Promise<GalleryApiResponse> => {
    const response = await http.post(ENDPOINTS.GET_GALLERY, { pageIndex, pageSize, title });
    return response.data;
};

export const insertGallery = async (data: GalleryItem): Promise<any> => {
    const response = await http.post(ENDPOINTS.INSERT_GALLERY, data);
    return response.data;
};

export const updateGallery = async (id: string, data: Partial<GalleryItem>): Promise<any> => {
    const response = await http.put(`${ENDPOINTS.UPDATE_GALLERY}/${id}`, data);
    return response.data;
};

export const deleteGallery = async (id: string): Promise<any> => {
    const response = await http.delete(`${ENDPOINTS.DELETE_GALLERY}/${id}`);
    return response.data;
};
