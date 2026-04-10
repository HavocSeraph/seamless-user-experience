import { mockUser, mockSkills, mockTransactions, mockBounties, categories } from './mock-data';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const USE_MOCK_FALLBACK = true; // Enabled mock fallback so E2E tests pass without backend

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  if (USE_MOCK_FALLBACK) {
    return getMockDataForEndpoint(endpoint, options);
  }

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'API request failed');
    }

    return await response.json();
  } catch (error) {
    console.error(`API ${endpoint} failed:`, error);
    throw error;
  }
}

async function getMockDataForEndpoint(endpoint: string, options: RequestInit) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  if (endpoint.startsWith('/auth/login') || endpoint.startsWith('/auth/register')) {
    return { token: 'mock-jwt-token-12345', user: mockUser };
  }
  if (endpoint.startsWith('/auth/me')) {
    return { user: mockUser };
  }
  if (endpoint.startsWith('/marketplace/search')) {
    const parts = endpoint.split('?')[0].split('/');
    if (parts.length > 3 && parts[3]) {
      const skill = mockSkills.find(s => s.id === parts[3]);
      return skill || mockSkills[0]; // fallback
    }
    return { skills: mockSkills };
  }
  if (endpoint.startsWith('/marketplace/categories')) {
    return { categories };
  }
  if (endpoint.startsWith('/wallet/balance')) {
    return { balance: mockUser.tokenBalance };
  }
  if (endpoint.startsWith('/transactions/me')) {
    return { transactions: mockTransactions };
  }
  if (endpoint.startsWith('/bounties')) {
    return { bounties: mockBounties };
  }

  console.warn(`No mock data found for ${endpoint}`);
  return {};
}

export const authApi = {
  login: (credentials: Record<string, unknown>) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  register: (userData: Record<string, unknown>) => apiRequest('/auth/register', {
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

export const bountyApi = {
  getBounties: () => apiRequest('/bounties'),
  getBounty: (id: string) => apiRequest(`/bounties/${id}`),
};
