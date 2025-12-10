import { Router, Response } from 'express';
import { authRequired, AuthRequest } from '../middlewares/auth';
import { Transaction } from '../models/Transaction';

const router = Router();

router.post('/wallet/deposit', authRequired, async (req: AuthRequest, res: Response) => {
  console.log('DEPOSIT:', req.body);
  let amount = Number(req.body.amount);

  if (isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: 'Cantidad inválida' });
  }

  const user = req.user!;
  user.balance += amount;
  await user.save();

  await Transaction.create({
    userId: user._id,
    type: 'deposit',
    amount
  });

  return res.json({ balance: user.balance });
}
);

router.post('/wallet/withdraw', authRequired, async (req: AuthRequest, res: Response) => {
    let amount = Number(req.body.amount);

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Cantidad inválida' });
    }

    const user = req.user!;
    if (user.balance < amount) {
      return res.status(400).json({ error: 'Saldo insuficiente' });
    }

    user.balance -= amount;
    await user.save();

    await Transaction.create({
      userId: user._id,
      type: 'withdraw',
      amount: -amount
    });

    return res.json({ balance: user.balance });
  }
);

export default router;
