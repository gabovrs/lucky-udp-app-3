import { apiFetch } from './client';

export async function deposit(amount: number) {
  return apiFetch<{ balance: number }>('/wallet/deposit', {
    method: 'POST',
    body: { amount },
  });
}

export async function withdraw(amount: number) {
  return apiFetch<{ balance: number }>('/wallet/withdraw', {
    method: 'POST',
    body: { amount },
  });
}
