import { Router, Response } from 'express';
import { authRequired, AuthRequest } from '../middlewares/auth';
import { settle, RouletteBet } from '../games/roulette';
import { Transaction } from '../models/Transaction';
import { RouletteWinner } from '../models/RouletteWinner';

const router = Router();

router.get('/roulette/winners', async (_req, res: Response) => {
  const winners = await RouletteWinner.find()
    .sort({ createdAt: -1 })
    .limit(12)
    .lean();

  return res.json(winners);
});

router.post('/roulette/bet', authRequired, async (req: AuthRequest, res: Response) => {
  const { betType, selection } = req.body as {
    betType?: string;
    selection?: string;
    amount?: number | string;
  };

  let amount = Number(req.body.amount);

  if (!betType || !selection) {
    return res.status(400).json({ error: 'Faltan datos de apuesta' });
  }

  if (isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: 'Cantidad inválida' });
  }

  const user = req.user!;
  if (user.balance < amount) {
    return res.status(400).json({ error: 'Saldo insuficiente' });
  }

  const bet: RouletteBet = {
    betType: betType as any,
    selection,
    amount
  };

  const result = settle(bet);

  const transaction = new Transaction({
    userId: user._id,
    type: 'bet'
  });

  if (result.payout > 0) {
    user.balance += result.payout;
    transaction.amount = result.payout;
  } else {
    user.balance -= amount;
    transaction.amount = -amount;
  }

  await user.save();
  await transaction.save();
  await RouletteWinner.create({
    number: result.number,
    color: result.color
  });

  return res.json({
    number: result.number,
    color: result.color,
    payout: result.payout,
    net: result.net,
    balance: user.balance
  });
}
);

export default router;