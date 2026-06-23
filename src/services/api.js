const API_BASE = 'https://api.freeapi.app/api/v1';

function getToken() {
  return localStorage.getItem('accessToken');
}

function setTokens(access, refresh) {
  localStorage.setItem('accessToken', access);
  if (refresh) localStorage.setItem('refreshToken', refresh);
}

function clearTokens() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export const api = {
  register: async (body) => {
    const res = await request('/users/register', { method: 'POST', body: JSON.stringify(body) });
    return res;
  },

  login: async (body) => {
    const res = await request('/users/login', { method: 'POST', body: JSON.stringify(body) });
    if (res.data?.accessToken) {
      setTokens(res.data.accessToken, res.data.refreshToken);
    }
    return res;
  },

  logout: async () => {
    try {
      await request('/users/logout', { method: 'POST' });
    } finally {
      clearTokens();
    }
  },

  currentUser: () => request('/users/current-user'),
};
