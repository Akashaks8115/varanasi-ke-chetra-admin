import http from '../../../services/http';
import { SpiritualPackage, SpiritualApiResponse } from '../../../types';

export const getSpiritualPackages = async (id: string = ''): Promise<SpiritualApiResponse> => {
    const response = await http.post<SpiritualApiResponse>('/api/spritual/getSpiritual', { id });
    console.log('getSpiritualPackages response:', response.data);
    return response.data;
};
