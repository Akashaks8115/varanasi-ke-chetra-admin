import http from '../../../services/http';
import { ENDPOINTS } from '../../../services/endpoints';
import { VKCEntity, ApiResponse } from '../../../types';

export const getJyotirlingItems = async (pageIndex: number = 1, pageSize: number = 10, id: string = ""): Promise<ApiResponse<VKCEntity>> => {
    const response = await http.post<ApiResponse<VKCEntity>>(ENDPOINTS.JYOTIRLING_LIST, {
        id: id,
        PageIndex: pageIndex,
        PageSize: pageSize
    });
    return response.data;
};

export const insertJyotirling = async (data: Partial<VKCEntity>): Promise<ApiResponse<VKCEntity>> => {
    console.log('Inserting new Jyotirling:', data);
    const response = await http.post<ApiResponse<VKCEntity>>(ENDPOINTS.INSERT_JYOTIRLING, data);
    console.log('Insert Jyotirling Response:', response.data);
    return response.data;
};

export const updateJyotirling = async (id: string, data: Partial<VKCEntity>): Promise<ApiResponse<VKCEntity>> => {
    console.log(`Updating Jyotirling with ID: ${id}`, data);
    const response = await http.patch<ApiResponse<VKCEntity>>(`${ENDPOINTS.UPDATE_JYOTIRLING}/${id}`, data);
    console.log('Update Jyotirling Response:', response.data);
    return response.data;
};

export const deleteJyotirling = async (id: string): Promise<ApiResponse<VKCEntity>> => {
    const response = await http.delete<ApiResponse<VKCEntity>>(`${ENDPOINTS.DELETE_JYOTIRLING}/${id}`);
    return response.data;
};
