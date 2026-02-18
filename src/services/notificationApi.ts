import http from './http';
import { NotificationPayload, NotificationApiResponse } from '../types';

export const sendNotification = async (payload: NotificationPayload): Promise<NotificationApiResponse> => {
    const response = await http.post<NotificationApiResponse>('/api/send-notification', payload);
    console.log('sendNotification response:', response.data);
    return response.data;
};
