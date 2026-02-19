import http from '../../../services/http';
import { ENDPOINTS } from '../../../services/endpoints';
import { TransportApiResponse } from '../../../types';

export const getTransportVehicles = async (id: string = ''): Promise<TransportApiResponse> => {
    const response = await http.post<TransportApiResponse>(ENDPOINTS.TRANSPORT_LIST, { id });
    console.log('getTransportVehicles response:', response.data);
    return response.data;
};
