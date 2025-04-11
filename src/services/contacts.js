import { SORT_ORDER } from '../constants/index.js';
import ContactsCollection from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;
  const contactsQuery = ContactsCollection.find();

  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }

  if (filter.maxphoneNumber !== undefined) {
    contactsQuery.where('phoneNumber').lte(filter.maxphoneNumber);
  }

  if (filter.minphoneNumber !== undefined) {
    contactsQuery.where('phoneNumber').gte(filter.minphoneNumber);
  }
  const [contactsCount, contacts] = await Promise.all([
    ContactsCollection.find().merge(contactsQuery).countDocuments(),
    contactsQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async (contactId) => {
  const contact = await ContactsCollection.findById(contactId);
  return contact;
};

export const createContact = async (payload) => {
  const contact = await ContactsCollection.create(payload);
  return contact;
};

export const updateContact = async (contactId, payload, userId) => {
  console.log('Updating contact:', contactId, payload, userId);
  const updatedContact = await ContactsCollection.findOneAndUpdate(
    { _id: contactId },
    payload,
    { new: true },
  );

  return updatedContact;
};

export const deleteContact = async (contactId) => {
  const contact = await ContactsCollection.findByIdAndDelete({
    _id: contactId,
  });

  return contact;
};
