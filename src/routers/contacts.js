import { Router } from 'express';
import {
  createContactCntroller,
  getContactsController,
  getStudentByIdController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrWrapper';

const router = Router();

router.get('/contacts', ctrlWrapper(getContactsController));
router.get('/contacts/:contactid', ctrlWrapper(getStudentByIdController));
router.post('/contcts', createContactCntroller);

export default router;
