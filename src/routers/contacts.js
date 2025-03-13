import { Router } from 'express';
import {
  createContactController,
  getContactsController,
  getContactByIdController,
  deleteContactController,
  patchContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createContactsSchema,
  updateContactsSchema,
} from '../validation/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';

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
  ctrlWrapper(createContactController),
);
router.patch(
  '/contacts/:contactid',
  isValidId,
  validateBody(updateContactsSchema),
  ctrlWrapper(patchContactController),
);
router.delete(
  '/contacts/:contactid',
  isValidId,
  ctrlWrapper(deleteContactController),
);

export default router;
