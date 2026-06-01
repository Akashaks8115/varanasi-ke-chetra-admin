import http from '../../../services/http';
import { ENDPOINTS } from '../../../services/endpoints';
import { VKCEntity, ApiResponse } from '../../../types';

export const getPanchkroshiItems = async (pageIndex: number = 1, pageSize: number = 10, id: string = ""): Promise<ApiResponse<VKCEntity>> => {
    const response = await http.post<ApiResponse<VKCEntity>>(ENDPOINTS.PANCHKROSHI_LIST, {
        id: id || null,
        PageIndex: pageIndex,
        PageSize: pageSize
    });
    return response.data;
};

export const insertPanchkroshi = async (data: Partial<VKCEntity>): Promise<ApiResponse<VKCEntity>> => {
    const response = await http.post<ApiResponse<VKCEntity>>(ENDPOINTS.INSERT_PANCHKROSHI, data);
    return response.data;
};

export const updatePanchkroshi = async (id: string, data: Partial<VKCEntity>): Promise<ApiResponse<VKCEntity>> => {
    const response = await http.post<ApiResponse<VKCEntity>>(ENDPOINTS.UPDATE_PANCHKROSHI, { id, ...data });
    return response.data;
};

export const deletePanchkroshi = async (id: string): Promise<ApiResponse<VKCEntity>> => {
    const response = await http.post<ApiResponse<VKCEntity>>(ENDPOINTS.DELETE_PANCHKROSHI, { id });
    return response.data;
};
