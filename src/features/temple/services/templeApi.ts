import http from '../../../services/http';
import { ENDPOINTS } from '../../../services/endpoints';
import { VKCEntity, ApiResponse } from '../../../types';

export const getTemplesItems = async (pageIndex: number = 1, pageSize: number = 10, id: string = ""): Promise<ApiResponse<VKCEntity>> => {
    const response = await http.post<ApiResponse<VKCEntity>>(ENDPOINTS.TEMPLE_LIST, {
        id: id,
        PageIndex: pageIndex,
        PageSize: pageSize
    });
    return response.data;
};

export const insertTemple = async (data: Partial<VKCEntity>): Promise<ApiResponse<VKCEntity>> => {
    const response = await http.post<ApiResponse<VKCEntity>>(ENDPOINTS.INSERT_TEMPLE, data);
    return response.data;
};

export const updateTemple = async (id: string, data: Partial<VKCEntity>): Promise<ApiResponse<VKCEntity>> => {
    const response = await http.patch<ApiResponse<VKCEntity>>(`${ENDPOINTS.UPDATE_TEMPLE}/${id}`, data);
    return response.data;
};

export const deleteTemple = async (id: string): Promise<ApiResponse<VKCEntity>> => {
    const response = await http.delete<ApiResponse<VKCEntity>>(`${ENDPOINTS.DELETE_TEMPLE}/${id}`);
    return response.data;
};
