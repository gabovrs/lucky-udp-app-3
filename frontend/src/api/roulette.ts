import { apiFetch } from './client';

export type BetType = 'straight' | 'color' | 'parity' | 'dozen';

export interface RouletteBetPayload {
  betType: BetType;
  selection: string;
  amount: number;
}

export interface RouletteBetResult {
  number: number;
  color: 'green' | 'red' | 'black';
  payout: number;
  net: number;
  balance: number;
}

export interface RouletteWinner {
  number: number;
  color: 'green' | 'red' | 'black';
  createdAt: string;
}

export async function placeBet(payload: RouletteBetPayload) {
  return apiFetch<RouletteBetResult>('/roulette/bet', {
    method: 'POST',
    body: payload,
  });
}

export async function getWinners() {
  return apiFetch<RouletteWinner[]>('/roulette/winners', {
    method: 'GET',
    auth: false,
  });
}
