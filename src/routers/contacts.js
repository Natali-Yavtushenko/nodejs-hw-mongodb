import { Router } from 'express';
import {
  createContactCntroller,
  getContactsController,
  getContactByIdController,
  deleteContactController,
  patchContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrWrapper';

const router = Router();

router.get('/contacts', ctrlWrapper(getContactsController));
router.get('/contacts/:contactid', ctrlWrapper(getContactByIdController));
router.post('/contacts', createContactCntroller);
router.patch('/contacts/:contactid', patchContactController);
router.delete('/contacts/:contactid', deleteContactController);

export default router;
