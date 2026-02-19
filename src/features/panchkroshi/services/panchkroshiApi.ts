import http from '../../../services/http';
import { ENDPOINTS } from '../../../services/endpoints';
import { VKCEntity, ApiResponse } from '../../../types';

export const getPanchkroshiItems = async (pageIndex: number = 1, pageSize: number = 10): Promise<ApiResponse<VKCEntity>> => {
    const response = await http.post<ApiResponse<VKCEntity>>(ENDPOINTS.PANCHKROSHI_LIST, {
        id: null,
        PageIndex: pageIndex,
        PageSize: pageSize
    });
    return response.data;
};
