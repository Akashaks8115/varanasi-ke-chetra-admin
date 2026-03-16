import http from '../../../services/http';
import { ENDPOINTS } from '../../../services/endpoints';
import { UserTokenApiResponse } from '../../../types';

export const getTokens = async (): Promise<UserTokenApiResponse> => {
    try {
        const response = await http.get<UserTokenApiResponse>(ENDPOINTS.GET_TOKENS);
        console.log('getTokens raw response:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('getTokens error:', error?.response?.status, error?.response?.data, error?.message);
        throw error;
    }
};
