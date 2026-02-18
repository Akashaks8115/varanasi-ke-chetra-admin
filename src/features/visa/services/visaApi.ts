import http from '../../../services/http';
import { VisaEnquiriesApiResponse } from '../../../types';

export const getVisaEnquiries = async (): Promise<VisaEnquiriesApiResponse> => {
    const response = await http.get<VisaEnquiriesApiResponse>('/api/visa/enquiries');
    console.log('getVisaEnquiries response:', response.data);
    return response.data;
};
