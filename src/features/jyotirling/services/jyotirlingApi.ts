import http from '../../../services/http';
import { ENDPOINTS } from '../../../services/endpoints';
import { VKCEntity, ApiResponse } from '../../../types';

export const getJyotirlingItems = async (pageIndex: number = 1, pageSize: number = 10): Promise<ApiResponse<VKCEntity>> => {
    const response = await http.post<ApiResponse<VKCEntity>>(ENDPOINTS.JYOTIRLING_LIST, {
        id: "",
        PageIndex: pageIndex,
        PageSize: pageSize
    });
    return response.data;
};
