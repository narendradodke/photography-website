export interface BookingPayload {
  full_name: string;
  phone: string;
  package_tier: string;
  event_date: string;
  message?: string;
}

export interface BookingResponse {
  success: boolean;
  message: string;
  booking_id: string;
}

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
}
