import http from '../../../services/http';
import { ENDPOINTS } from '../../../services/endpoints';
import { VKCEntity, ApiResponse } from '../../../types';

export const getActivityItems = async (): Promise<ApiResponse<VKCEntity>> => {
    const response = await http.get<ApiResponse<VKCEntity>>(ENDPOINTS.GET_ACTIVITY);
    return response.data;
};

export const getActivityById = async (id: string): Promise<ApiResponse<VKCEntity>> => {
    const response = await http.post<ApiResponse<VKCEntity>>(ENDPOINTS.ACTIVITY_BY_CATID, { id });
    return response.data;
};

export const getActivityByCatId = async (catId: number): Promise<ApiResponse<VKCEntity>> => {
    const response = await http.post<ApiResponse<VKCEntity>>(ENDPOINTS.ACTIVITY_BY_CATID, { CatId: catId });
    return response.data;
};

export const insertActivity = async (data: Partial<VKCEntity>): Promise<ApiResponse<VKCEntity>> => {
    const response = await http.post<ApiResponse<VKCEntity>>(ENDPOINTS.INSERT_ACTIVITY, data);
    return response.data;
};

export const updateActivity = async (id: string, data: Partial<VKCEntity>): Promise<ApiResponse<VKCEntity>> => {
    const response = await http.post<ApiResponse<VKCEntity>>(ENDPOINTS.UPDATE_ACTIVITY, { id, ...data });
    return response.data;
};

export const deleteActivity = async (id: string): Promise<ApiResponse<VKCEntity>> => {
    const response = await http.post<ApiResponse<VKCEntity>>(ENDPOINTS.DELETE_ACTIVITY, { id });
    return response.data;
};
