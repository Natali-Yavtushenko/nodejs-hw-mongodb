import { Router } from 'express';
import {
  createContactCntroller,
  getContactsController,
  getContactByIdController,
  deleteContactController,
  patchContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createContactsSchema,
  updateContactsSchema,
} from '../validation/contacts.js';
import { isValidId } from '../middlewares/isvalidId.js';

const router = Router();

router.get('/contacts', ctrlWrapper(getContactsController));
router.get(
  '/contacts/:contactid',
  isValidId,
  ctrlWrapper(getContactByIdController),
);
router.post(
  '/contacts',
  validateBody(createContactsSchema),
  ctrlWrapper(createContactCntroller),
);
router.patch(
  '/contacts/:contactid',
  validateBody(updateContactsSchema),
  ctrlWrapper(patchContactController),
);
router.delete('/contacts/:contactid', ctrlWrapper(deleteContactController));

export default router;
