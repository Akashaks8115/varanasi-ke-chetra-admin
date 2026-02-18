import http from '../../../services/http';
import { TransportApiResponse } from '../../../types';

export const getTransportVehicles = async (id: string = ''): Promise<TransportApiResponse> => {
    const response = await http.post<TransportApiResponse>('/api/transport/get', { id });
    console.log('getTransportVehicles response:', response.data);
    return response.data;
};
