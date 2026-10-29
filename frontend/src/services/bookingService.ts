import { apiClient } from './api';
import type { BookingPayload, BookingResponse } from '../types/booking';

export async function submitBooking(data: BookingPayload): Promise<BookingResponse> {
  const response = await apiClient.post<BookingResponse>('/booking', data);
  return response.data;
}
