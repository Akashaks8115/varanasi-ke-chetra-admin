import { ReactNode } from "react";

export interface VKCEntity {
    CatId: ReactNode;
    _id: string | { $oid: string };
    Title: string;
    SubTitle: string;
    Description1?: string;
    Description2?: string;
    Description3?: string;
    ProfileUrl: string;
    BannerUrl1: string;
    BannerUrl2: string;
    Location: string;
    IsShow?: number;
    Address?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    TotalCount?: number;
    PageIndex?: number;
    PageSize?: number;
    Data: T[] | T; // Can be an array for 'get' or a single object for 'insert/update'
}

export interface OurService {
    _id: string;
    icon: string;
    title: string;
    subtitle: string;
    sId: number;
}

export interface ServicesApiResponse {
    success: boolean;
    message: string;
    data: OurService[];
}

export interface SpiritualPackage {
    _id: string;
    images: string[];
    title: string;
    subtitle: string;
    places?: string[];
    includes?: string[];
    contactNumber?: string;
    duration?: string;
    city?: string;
}

export interface SpiritualApiResponse {
    success: boolean;
    message: string;
    data: SpiritualPackage[] | SpiritualPackage;
}

export interface TransportVehicle {
    _id: string;
    title: string;
    seats: number;
    model: string;
    image: string;
    category?: string;
    description?: string;
    baggage?: string;
    safety?: string;
    inCabFeatures?: string[];
    contactNumber?: string;
    vehicleType?: string;
}

export interface TransportApiResponse {
    success: boolean;
    message: string;
    data: TransportVehicle[];
}

export interface TravelEnquiry {
    _id: string;
    name: string;
    contactNumber: string;
    email: string;
    fromLocation: string;
    toLocation: string;
    fromDate: string;
    toDate: string;
    adult: number;
    child: number;
    createdDate: string;
    __v?: number;
}

export interface FlightEnquiriesApiResponse {
    success: boolean;
    message: string;
    TotalCount: number;
    PageIndex: number;
    PageSize: number;
    Data: TravelEnquiry[];
}

export interface VisaEnquiriesApiResponse {
    success: boolean;
    message: string;
    TotalCount: number;
    PageIndex: number;
    PageSize: number;
    Data: TravelEnquiry[];
}

export interface ImageUploadResponse {
    success: boolean;
    message: string;
    imageUrl?: string; // Keep for backward compatibility if used
    url: string;      // Real server response uses 'url'
    public_id: string;
}

export interface NotificationPayload {
    title: string;
    body: string;
    image: string;
    data: {
        id: string;
        image: string;
    }
}

export interface NotificationApiResponse {
    success: boolean;
    message: string;
}

export interface UserToken {
    _id: string | { $oid: string };
    token: string;
    userId: string;
    __v: number;
}

export interface UserTokenApiResponse {
    success: boolean;
    data: UserToken[];
}

export interface Banner {
    _id?: string;
    title: string;
    subtitle: string;
    imageUrl: string;
    redirectUrl: string;
    isActive: boolean;
}

export interface BannerApiResponse {
    success: boolean;
    data: Banner[] | Banner;
}

export interface AartiSession {
    sessionId: string;
    type: string;
    title: string;
    calculatedAartiTime: string;
    duration: string;
    isModifiedManually: boolean;
    specialNote: string;
    _id: string;
}

export interface AartiGhat {
    ghatId: string;
    ghatName: string;
    ghatImage: string;
    shortDescription: string;
    googleMapsUrl: string;
    crowdStatus: string;
    sessions: AartiSession[];
    _id: string;
}

export interface AartiTimingData {
    _id: string;
    date: string;
    status: string;
    message: string;
    ghatsData: AartiGhat[];
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface AartiTimingApiResponse {
    success: boolean;
    data: AartiTimingData;
}

export interface EventVenue {
    name: string;
    googleMapsUrl: string;
}

export interface EventDates {
    startDate: string;
    endDate: string;
    eventTiming: string;
}

export interface Event {
    _id?: string;
    eventId: string;
    title: string;
    subtitle: string;
    eventImage: string;
    description: string;
    category: string;
    venue: EventVenue;
    dates: EventDates;
    entryType: string;
    boatBookingRequired: boolean;
    crowdAlert: string;
    tags: string[];
}

export interface EventApiResponse {
    success: boolean;
    message: string;
    data: Event[];
}
