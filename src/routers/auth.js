import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody';
import { registerUserSchema } from '../validation/auth';
import { ctrlWrapper } from '../utils/ctrlWrapper';
import { registerUserController } from '../controllers/auth';

router.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

export default router;
