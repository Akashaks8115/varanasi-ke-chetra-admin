import http from '../../../services/http';
import { ENDPOINTS } from '../../../services/endpoints';
import { SpiritualPackage, SpiritualApiResponse } from '../../../types';

export const getSpiritualPackages = async (id: string = ''): Promise<SpiritualApiResponse> => {
    const response = await http.post<SpiritualApiResponse>(ENDPOINTS.SPIRITUAL_LIST, { id });
    return response.data;
};

export const insertSpiritual = async (data: Partial<SpiritualPackage>): Promise<SpiritualApiResponse> => {
    const response = await http.post<SpiritualApiResponse>(ENDPOINTS.INSERT_SPIRITUAL, data);
    return response.data;
};

export const updateSpiritual = async (id: string, data: Partial<SpiritualPackage>): Promise<SpiritualApiResponse> => {
    const response = await http.patch<SpiritualApiResponse>(`${ENDPOINTS.UPDATE_SPIRITUAL}/${id}`, data);
    return response.data;
};

export const deleteSpiritual = async (id: string): Promise<SpiritualApiResponse> => {
    const response = await http.delete<SpiritualApiResponse>(`${ENDPOINTS.DELETE_SPIRITUAL}/${id}`);
    return response.data;
};
