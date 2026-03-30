const API_BASE_URL = 'http://localhost:3000/api';

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('skill_barter_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'API request failed');
  }

  return response.json();
}

export const authApi = {
  login: (credentials: any) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  register: (userData: any) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  getMe: () => apiRequest('/auth/me'),
};

export const marketplaceApi = {
  getSkills: (query?: string) => apiRequest(`/marketplace/search${query ? `?q=${query}` : ''}`),
  getSkill: (id: string) => apiRequest(`/marketplace/search/${id}`),
  getCategories: () => apiRequest('/marketplace/categories'),
};

export const walletApi = {
  getBalance: () => apiRequest('/wallet/balance'),
  getTransactions: () => apiRequest('/transactions/me'),
};
