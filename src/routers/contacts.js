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

router.get('/', ctrlWrapper(getContactsController));
router.get('/:contactid', isValidId, ctrlWrapper(getContactByIdController));
router.post(
  '/',
  validateBody(createContactsSchema),
  ctrlWrapper(createContactController),
);
router.patch(
  '/:contactid',
  isValidId,
  validateBody(updateContactsSchema),
  ctrlWrapper(patchContactController),
);
router.delete('/:contactid', isValidId, ctrlWrapper(deleteContactController));

export default contactRouter;
