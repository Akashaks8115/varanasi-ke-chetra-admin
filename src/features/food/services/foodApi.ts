import http from '../../../services/http';
import { ENDPOINTS } from '../../../services/endpoints';
import { VKCEntity, ApiResponse } from '../../../types';

export const getFoodsItems = async (pageIndex: number = 1, pageSize: number = 10, id: string = "", name: string = ""): Promise<ApiResponse<VKCEntity>> => {
    const payload: any = {
        PageIndex: pageIndex,
        PageSize: pageSize,
    };
    if (id) {
        payload.id = id;
    }
    if (name) {
        payload.Name = name;
    }

    const response = await http.post<ApiResponse<VKCEntity>>(ENDPOINTS.FOOD_LIST, payload);
    return response.data;
};

export const insertFood = async (data: Partial<VKCEntity>): Promise<ApiResponse<VKCEntity>> => {
    const response = await http.post<ApiResponse<VKCEntity>>(ENDPOINTS.INSERT_FOOD, data);
    return response.data;
};

export const updateFood = async (id: string, data: Partial<VKCEntity>): Promise<ApiResponse<VKCEntity>> => {
    const response = await http.post<ApiResponse<VKCEntity>>(ENDPOINTS.UPDATE_FOOD, {
        id,
        ...data
    });
    return response.data;
};

export const deleteFood = async (id: string): Promise<ApiResponse<VKCEntity>> => {
    const response = await http.post<ApiResponse<VKCEntity>>(ENDPOINTS.DELETE_FOOD, { id });
    return response.data;
};
