import { apiClient } from './api';
import type { ContactPayload, ContactResponse } from '../types/booking';

export async function submitContact(data: ContactPayload): Promise<ContactResponse> {
  const response = await apiClient.post<ContactResponse>('/contact', data);
  return response.data;
}
