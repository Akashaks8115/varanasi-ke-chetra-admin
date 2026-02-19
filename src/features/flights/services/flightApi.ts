import http from '../../../services/http';
import { ENDPOINTS } from '../../../services/endpoints';
import { FlightEnquiriesApiResponse } from '../../../types';

export const getFlightEnquiries = async (): Promise<FlightEnquiriesApiResponse> => {
    const response = await http.get<FlightEnquiriesApiResponse>(ENDPOINTS.FLIGHT_ENQUIRIES);
    console.log('getFlightEnquiries response:', response.data);
    return response.data;
};
