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
import { authenticate } from '../middlewares/authenticate.js';

const contactRouter = Router();

contactRouter.use(authenticate);

contactRouter.get('/', ctrlWrapper(getContactsController));
contactRouter.get(
  '/:contactid',
  isValidId,
  ctrlWrapper(getContactByIdController),
);
contactRouter.post(
  '/',
  validateBody(createContactsSchema),
  ctrlWrapper(createContactController),
);
contactRouter.patch(
  '/:contactid',
  isValidId,
  validateBody(updateContactsSchema),
  ctrlWrapper(patchContactController),
);
contactRouter.delete(
  '/:contactid',
  isValidId,
  ctrlWrapper(deleteContactController),
);

export default contactRouter;
