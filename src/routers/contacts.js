import { Router } from 'express';
import {
  createContactCntroller,
  getContactsController,
  getContactByIdController,
  deleteContactController,
  patchContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrWrapper.js';

const router = Router();

router.get('/contacts', ctrlWrapper(getContactsController));
router.get('/contacts/:contactid', ctrlWrapper(getContactByIdController));
router.post('/contacts', ctrlWrapper(createContactCntroller));
router.patch('/contacts/:contactid', ctrlWrapper(patchContactController));
router.delete('/contacts/:contactid', ctrlWrapper(deleteContactController));

export default router;
