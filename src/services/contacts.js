import { SORT_ORDER } from '../constants/index.js';
import ContactCollection from '../models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
  userId,
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;
  const contactsQuery = ContactCollection.find({ userId });

  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }

  if (filter.maxphoneNumber) {
    contactsQuery.where('phoneNumber').lte(filter.maxphoneNumber);
  }

  if (filter.minphoneNumber) {
    contactsQuery.where('phoneNumber').gte(filter.minphoneNumber);
  }

  const [contactsCount, contacts] = await Promise.all([
    ContactCollection.find({ userId }).merge(contactsQuery).countDocuments(),
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

export function getContactById(contactid, userId) {
  return ContactCollection.findOne({ _id: contactid, userId });
}

export const createContact = async (payload) => {
  return await ContactCollection.create(payload);
};

export const updateContact = async (
  contactid,
  payload,
  userId,
  options = {},
) => {
  const rawResult = await ContactCollection.findOneAndUpdate(
    { _id: contactid, userId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult) return null;

  return {
    contact: rawResult,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

export const deleteContact = async (contactid, userId) => {
  return await ContactCollection.findOneAndDelete({ _id: contactid, userId });
};
