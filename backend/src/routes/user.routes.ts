import { Router, Response } from 'express';
import { authRequired, AuthRequest } from '../middlewares/auth';
import { Transaction } from '../models/Transaction';

const router = Router();

router.get('/me', authRequired, async (req: AuthRequest, res: Response) => {
  const user = req.user!;
  return res.json({
    id: user._id,
    username: user.username,
    balance: user.balance,
    createdAt: user.createdAt
  });
});

router.get('/history/transactions', authRequired, async (req: AuthRequest, res: Response) => {
  const tx = await Transaction.find({ userId: req.user!._id })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  return res.json(tx);
}
);

export default router;