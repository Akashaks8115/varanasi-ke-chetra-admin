import http from '../../../services/http';
import { ENDPOINTS } from '../../../services/endpoints';
import { AartiTimingApiResponse } from '../../../types';

export const getAartiTimings = async (): Promise<AartiTimingApiResponse> => {
    const response = await http.get<AartiTimingApiResponse>(ENDPOINTS.AARTI_TIMINGS);
    return response.data;
};

export const updateAartiTiming = async (date: string, data: any): Promise<any> => {
    const response = await http.put(`${ENDPOINTS.AARTI_TIMINGS}/${date}`, data);
    return response.data;
};
