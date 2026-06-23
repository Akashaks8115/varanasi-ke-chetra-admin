import http from '../../../services/http';
import { ENDPOINTS } from '../../../services/endpoints';
import { Event, EventApiResponse } from '../../../types';

export const getEvents = async (id?: string): Promise<EventApiResponse> => {
    const url = id ? `${ENDPOINTS.GET_EVENTS}?id=${id}` : ENDPOINTS.GET_EVENTS;
    const response = await http.get<EventApiResponse>(url);
    return response.data;
};

export const insertEvent = async (data: Event): Promise<any> => {
    const response = await http.post(ENDPOINTS.INSERT_EVENT, data);
    return response.data;
};

export const updateEvent = async (data: Event & { id: string }): Promise<any> => {
    const response = await http.put(ENDPOINTS.UPDATE_EVENT, data);
    return response.data;
};

export const deleteEvent = async (id: string): Promise<any> => {
    const response = await http.delete(ENDPOINTS.DELETE_EVENT, { data: { id } });
    return response.data;
};
