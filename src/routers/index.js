import { Router } from 'express';
import contactsRouter from 
const router = Router();

router.use('/contacts', contactsRouter);
router.use('/auth', authRouter);

export default router;
