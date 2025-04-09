import { Router } from 'express';
import {
  createContactController,
  deleteContactController,
  getContactByIdController,
  getContactsController,
  patchContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';

import { upload } from '../middlewares/multer.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isvalidId.js';
import { authenticate } from '../middlewares/authenticate.js';

const contactRouter = Router();

contactRouter.use(authenticate);

contactRouter.get('/', ctrlWrapper(getContactsController));

contactRouter.get(
  '/:contactId',
  isValidId,
  ctrlWrapper(getContactByIdController),
);

contactRouter.post(
  '/',
  upload.single('photo'),
  validateBody(createContactsSchema),

  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);

contactRouter.patch(
  '/:contactId',
  isValidId,

  upload.single('photo'),
  validateBody(updateContactsSchema),

  validateBody(updateContactSchema),

  ctrlWrapper(patchContactController),
);

contactRouter.delete(
  '/:contactId',
  isValidId,
  ctrlWrapper(deleteContactController),
);

export default contactRouter;
