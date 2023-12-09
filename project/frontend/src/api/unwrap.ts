import { HttpResponse } from './api';

export function unwrap<T>(response: HttpResponse<T>): T {
  console.log('unwrap', { response });
  if (!response.ok) {
    const errorMessage = response.body
      ? response.body.toString()
      : 'Unknown error';
    throw new Error(`API error: ${errorMessage}`);
  }
  return response.data;
}
