import http from '../../../services/http';
import { ENDPOINTS } from '../../../services/endpoints';
import { VKCEntity, ApiResponse } from '../../../types';

export const getHistoricalPlacesItems = async (pageIndex: number = 1, pageSize: number = 10, id: string = ""): Promise<ApiResponse<VKCEntity>> => {
    const response = await http.post<ApiResponse<VKCEntity>>(ENDPOINTS.HISTORICAL_PLACE_LIST, {
        id: id,
        PageIndex: pageIndex,
        PageSize: pageSize
    });
    return response.data;
};

export const insertHistoricalPlace = async (data: Partial<VKCEntity>): Promise<ApiResponse<VKCEntity>> => {
    const response = await http.post<ApiResponse<VKCEntity>>(ENDPOINTS.INSERT_HISTORICAL_PLACE, data);
    return response.data;
};

export const updateHistoricalPlace = async (id: string, data: Partial<VKCEntity>): Promise<ApiResponse<VKCEntity>> => {
    const response = await http.patch<ApiResponse<VKCEntity>>(`${ENDPOINTS.UPDATE_HISTORICAL_PLACE}/${id}`, data);
    return response.data;
};

export const deleteHistoricalPlace = async (id: string): Promise<ApiResponse<VKCEntity>> => {
    const response = await http.delete<ApiResponse<VKCEntity>>(`${ENDPOINTS.DELETE_HISTORICAL_PLACE}/${id}`);
    return response.data;
};
