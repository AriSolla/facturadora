export const API_BASE_URL = 'https://homa.rtitec.com.ar/endpoint/testing';

export async function fetchAPI(endpoint: string, params?: Record<string, string | number>) {
  let url = `${API_BASE_URL}/${endpoint}`;
  
  // Si hay parámetros, agregarlos a la URL
  if (params) {
    const queryString = new URLSearchParams(
      Object.entries(params).map(([key, value]) => [key, String(value)])
    ).toString();
    url += `?${queryString}`;
  }
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}