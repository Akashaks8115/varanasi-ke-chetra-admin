import http from '../../../services/http';
import { VKCEntity, ApiResponse } from '../../../types';

export const getPanchkroshiItems = async (pageIndex: number = 1, pageSize: number = 10): Promise<ApiResponse<VKCEntity>> => {
    const response = await http.post<ApiResponse<VKCEntity>>('/api/panchkroshi/places', {
        id: null,
        PageIndex: pageIndex,
        PageSize: pageSize
    });
    return response.data;
};
