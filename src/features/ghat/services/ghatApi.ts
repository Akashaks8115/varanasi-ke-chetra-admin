import http from '../../../services/http';
import { VKCEntity, ApiResponse } from '../../../types';

export const getGhatsItems = async (pageIndex: number = 1, pageSize: number = 10): Promise<ApiResponse<VKCEntity>> => {
    const response = await http.post<ApiResponse<VKCEntity>>('/api/ghats/Ghats', {
        id: "",
        PageIndex: pageIndex,
        PageSize: pageSize
    });
    return response.data;
};
