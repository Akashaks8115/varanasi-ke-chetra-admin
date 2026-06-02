import http from '../../../services/http';
import { ENDPOINTS } from '../../../services/endpoints';
import { VisaEnquiriesApiResponse } from '../../../types';

export const getVisaEnquiries = async (pageIndex: number = 1, pageSize: number = 10): Promise<VisaEnquiriesApiResponse> => {
    const response = await http.get<VisaEnquiriesApiResponse>(`${ENDPOINTS.VISA_ENQUIRIES}?PageIndex=${pageIndex}&PageSize=${pageSize}`);
    console.log('getVisaEnquiries response:', response.data);
    return response.data;
};
