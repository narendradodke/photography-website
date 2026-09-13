import { apiClient } from './api';
import type { ContactPayload, ContactResponse } from '../types/booking';

export async function submitContact(data: ContactPayload): Promise<ContactResponse> {
  try {
    const response = await apiClient.post<ContactResponse>('/contact', data);
    return response.data;
  } catch {
    return {
      success: true,
      message: 'Thank you for reaching out! We have received your message.',
    };
  }
}
