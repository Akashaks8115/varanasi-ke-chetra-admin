import http from '../../../services/http';
import { ENDPOINTS } from '../../../services/endpoints';
import { FlightEnquiriesApiResponse } from '../../../types';

export const getFlightEnquiries = async (pageIndex: number = 1, pageSize: number = 10): Promise<FlightEnquiriesApiResponse> => {
    const response = await http.get<FlightEnquiriesApiResponse>(`${ENDPOINTS.FLIGHT_ENQUIRIES}?PageIndex=${pageIndex}&PageSize=${pageSize}`);
    console.log('getFlightEnquiries response:', response.data);
    return response.data;
};

export const deleteFlightEnquiry = async (id: string): Promise<any> => {
    const response = await http.delete(`${ENDPOINTS.FLIGHT_ENQUIRIES}/${id}`);
    return response.data;
};
