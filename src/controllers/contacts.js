import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);
  const userId = req.user._id;

  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId,
  });

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactid } = req.params;
  const userId = req.user._id;

  const contact = await getContactById(contactid, userId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactid}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const userId = req.user._id;
  const contact = await createContact({ ...req.body, userId });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const patchContactController = async (req, res) => {
  const { contactid } = req.params;
  const userId = req.user._id;

  const updatedContact = await updateContact(contactid, req.body, userId);

  if (!updatedContact) {
    throw createHttpError(404, 'Contact not found');
  }

  const { _id, name, phoneNumber, email, isFavourite, contactType } =
    updatedContact.toObject();

  res.json({
    status: 200,
    message: `Successfully patched a contact!`,
    data: { _id, name, phoneNumber, email, isFavourite, contactType },
  });
};

export const deleteContactController = async (req, res) => {
  const { contactid } = req.params;
  const userId = req.user._id;

  const contact = await deleteContact(contactid, userId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).send();
};
