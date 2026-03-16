import http from '../../../services/http';
import { ENDPOINTS } from '../../../services/endpoints';
import { Banner, BannerApiResponse } from '../../../types';

export const getBanners = async (): Promise<BannerApiResponse> => {
    const response = await http.post<BannerApiResponse>(ENDPOINTS.BANNER_LIST, {});
    return response.data;
};

export const insertBanner = async (data: Banner): Promise<BannerApiResponse> => {
    const response = await http.post<BannerApiResponse>(ENDPOINTS.INSERT_BANNER, data);
    return response.data;
};

export const updateBanner = async (data: Partial<Banner> & { id: string }): Promise<BannerApiResponse> => {
    const response = await http.post<BannerApiResponse>(ENDPOINTS.UPDATE_BANNER, data);
    return response.data;
};

export const deleteBanner = async (id: string): Promise<BannerApiResponse> => {
    const response = await http.post<BannerApiResponse>(ENDPOINTS.DELETE_BANNER, { id });
    return response.data;
};
