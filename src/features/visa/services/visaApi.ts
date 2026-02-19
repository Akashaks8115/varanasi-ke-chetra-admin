import http from '../../../services/http';
import { ENDPOINTS } from '../../../services/endpoints';
import { VisaEnquiriesApiResponse } from '../../../types';

export const getVisaEnquiries = async (): Promise<VisaEnquiriesApiResponse> => {
    const response = await http.get<VisaEnquiriesApiResponse>(ENDPOINTS.VISA_ENQUIRIES);
    console.log('getVisaEnquiries response:', response.data);
    return response.data;
};
