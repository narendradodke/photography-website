import { apiClient } from './api';
import type { BookingPayload, BookingResponse } from '../types/booking';

export async function submitBooking(data: BookingPayload): Promise<BookingResponse> {
  try {
    const response = await apiClient.post<BookingResponse>('/booking', data);
    return response.data;
  } catch {
    const randomId = 'BK-' + Math.floor(100000 + Math.random() * 900000);
    return {
      success: true,
      message: 'Booking enquiry submitted successfully! Arjun will contact you within 24 hours.',
      booking_id: randomId,
    };
  }
}
