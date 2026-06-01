import http from '../../../services/http';
import { ENDPOINTS } from '../../../services/endpoints';
import { VKCEntity, ApiResponse } from '../../../types';

export const getCategoryItems = async (): Promise<ApiResponse<VKCEntity>> => {
    const response = await http.get<ApiResponse<VKCEntity>>(ENDPOINTS.GET_CATEGORY);
    return response.data;
};

export const insertCategory = async (data: Partial<VKCEntity>): Promise<ApiResponse<VKCEntity>> => {
    const response = await http.post<ApiResponse<VKCEntity>>(ENDPOINTS.INSERT_CATEGORY, data);
    return response.data;
};

export const updateCategory = async (id: string, data: Partial<VKCEntity>): Promise<ApiResponse<VKCEntity>> => {
    const response = await http.post<ApiResponse<VKCEntity>>(ENDPOINTS.UPDATE_CATEGORY, { id, ...data });
    return response.data;
};

export const deleteCategory = async (id: string): Promise<ApiResponse<VKCEntity>> => {
    const response = await http.post<ApiResponse<VKCEntity>>(ENDPOINTS.DELETE_CATEGORY, { id });
    return response.data;
};
