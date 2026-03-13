import http from '../../../services/http';
import { ENDPOINTS } from '../../../services/endpoints';
import { VKCEntity, ApiResponse } from '../../../types';

export const getGhatsItems = async (pageIndex: number = 1, pageSize: number = 10, id: string = ""): Promise<ApiResponse<VKCEntity>> => {
    const response = await http.post<ApiResponse<VKCEntity>>(ENDPOINTS.GHAT_LIST, {
        id: id,
        PageIndex: pageIndex,
        PageSize: pageSize
    });
    return response.data;
};

export const insertGhat = async (data: Partial<VKCEntity>): Promise<ApiResponse<VKCEntity>> => {
    console.log('Inserting new ghat:', data);
    const response = await http.post<ApiResponse<VKCEntity>>(ENDPOINTS.INSERT_GHAT, data);
    console.log('Insert Ghat Response:', response.data);
    return response.data;
};

export const updateGhat = async (id: string, data: Partial<VKCEntity>): Promise<ApiResponse<VKCEntity>> => {
    console.log(`Updating ghat with ID: ${id}`, data);
    const response = await http.patch<ApiResponse<VKCEntity>>(`${ENDPOINTS.UPDATE_GHAT}/${id}`, data);

    console.log('Update Ghat Response:', response.data);
    return response.data;
};

export const deleteGhat = async (id: string): Promise<ApiResponse<VKCEntity>> => {
    const response = await http.delete<ApiResponse<VKCEntity>>(`${ENDPOINTS.DELETE_GHAT}/${id}`);
    return response.data;
};
