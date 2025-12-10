import { RouletteColor } from '../models/RouletteWinner';

const REDS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

export function colorForNumber(number: number): RouletteColor {
  if (number === 0) {
    return RouletteColor.GREEN;
  } else if (REDS.includes(number)) {
    return RouletteColor.RED;
  } else {
    return RouletteColor.BLACK;
  }
}

export interface RouletteSpinResult {
  number: number;
  color: RouletteColor;
}

export enum BetType {
  STRAIGHT = 'straight',
  COLOR = 'color',
  PARITY = 'parity',
  DOZEN = 'dozen',
}

export interface RouletteBet {
  betType: BetType;
  selection: string;
  amount: number;
}

export interface RouletteSettleResult extends RouletteSpinResult {
  payout: number;
  net: number;
  won: boolean;
}

export function spin(): RouletteSpinResult {
  const number = Math.floor(Math.random() * 37); // 0-36
  const color = colorForNumber(number);
  return { number, color };
}

export function settle(bet: RouletteBet): RouletteSettleResult {
  const { number, color } = spin();
  let won = false;
  let payout = 0;
  const amt = bet.amount;

  switch (bet.betType) {
    case 'straight':
      won = Number(bet.selection) === number;
      payout = won ? amt * 35 : 0;
      break;
    case 'color':
      won = bet.selection === color && color !== 'green';
      payout = won ? amt * 1 : 0;
      break;
    case 'parity':
      if (number === 0) {
        won = false;
      } else {
        const isEven = number % 2 === 0;
        won =
          (bet.selection === 'even' && isEven) ||
          (bet.selection === 'odd' && !isEven);
      }
      payout = won ? amt * 1 : 0;
      break;
    case 'dozen': {
      let d = 0;
      if (number >= 1 && number <= 12) d = 1;
      else if (number >= 13 && number <= 24) d = 2;
      else if (number >= 25 && number <= 36) d = 3;

      won = Number(bet.selection) === d;
      payout = won ? amt * 2 : 0;
      break;
    }
    default:
      throw new Error('Bet no soportada');
  }

  const net = payout - amt;
  return { number, color, payout, net, won };
}