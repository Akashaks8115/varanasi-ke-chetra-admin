import http from './http';
import { ENDPOINTS } from './endpoints';
import { NotificationPayload, NotificationApiResponse } from '../types';

export const sendNotification = async (payload: NotificationPayload): Promise<NotificationApiResponse> => {
    const response = await http.post<NotificationApiResponse>(ENDPOINTS.SEND_NOTIFICATION, payload);
    console.log('sendNotification response:', response.data);
    return response.data;
};
