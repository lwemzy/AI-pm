import config from '../config';
const headers = {
  'Content-Type': 'application/json'
};
export async function fetchData<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${config.apiUrl}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...options.headers
    }
  });
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  return response.json();
}
export const api = {
  auth: {
    login: (credentials: {
      email: string;
      password: string;
    }) => fetchData('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    })
  },
  prescriptions: {
    list: () => fetchData('/prescriptions'),
    get: (id: string) => fetchData(`/prescriptions/${id}`)
  }
  // Add other API endpoints as needed
};