import { apiFetch } from './client';

export interface UserDTO {
  id: string;
  username: string;
  balance: number;
  createdAt: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: UserDTO;
}

export interface RegisterResponse {
  message: string;
  user: UserDTO;
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  const res = await apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: { username, password },
    auth: false,
  });

  // guardamos el token
  localStorage.setItem('authToken', res.token);
  return res;
}

export async function register(username: string, password: string, password2: string) {
  return apiFetch<RegisterResponse>('/auth/register', {
    method: 'POST',
    body: { username, password, password2 },
    auth: false,
  });
}

export function logoutLocal() {
  localStorage.removeItem('authToken');
}
