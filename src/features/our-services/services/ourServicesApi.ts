import http from '../../../services/http';
import { OurService, ServicesApiResponse } from '../../../types';

export const getServices = async (): Promise<ServicesApiResponse> => {
    try {
        const response = await http.post<ServicesApiResponse>('/api/getServices');
        console.log('getServices raw response:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('getServices error:', error?.response?.status, error?.response?.data, error?.message);
        throw error;
    }
};
