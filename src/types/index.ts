export interface VKCEntity {
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
    total: number;
    page: number;
    totalPages: number;
    data: TravelEnquiry[];
}

export interface VisaEnquiriesApiResponse {
    success: boolean;
    total: number;
    page: number;
    totalPages: number;
    data: TravelEnquiry[];
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
