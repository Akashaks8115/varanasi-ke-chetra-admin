import http from '../../../services/http';
import { FlightEnquiriesApiResponse } from '../../../types';

export const getFlightEnquiries = async (): Promise<FlightEnquiriesApiResponse> => {
    const response = await http.get<FlightEnquiriesApiResponse>('/api/flight/enquiries');
    console.log('getFlightEnquiries response:', response.data);
    return response.data;
};
