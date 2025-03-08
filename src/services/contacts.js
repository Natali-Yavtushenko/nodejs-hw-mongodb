import { SORT_ORDER } from '../constants/index.js';
import ContactCollection from '../models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = ContactCollection.find();

  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }

  if (filter.maxphoneNumber) {
    contactsQuery.where('phoneNumber').lte(filter.maxphoneNumber);
  }

  if (filter.minphoneNumber) {
    contactsQuery.where('phoneNumber').gte(filter.minphoneNumber);
  }
  const contactsCount = await ContactCollection.find()
    .merge(contactsQuery)
    .countDocuments();

  if (skip >= contactsCount) {
    return {
      data: [],
      total: contactsCount,
      page,
      perPage,
      totalPages: Math.ceil(contactsCount / perPage),
    };
  }
  const contacts = await contactsQuery.skip(skip).limit(limit).exec();

  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};

export function getContactById(contactid) {
  return ContactCollection.findById(contactid);
}

export const createContact = async (payload) => {
  const contact = await ContactCollection.create(payload);
  return contact;
};

export const updateContact = async (contactid, payload, options = {}) => {
  const rawResult = await ContactCollection.findOneAndUpdate(
    { _id: contactid },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

export const deleteContact = async (contactid) => {
  const contact = await ContactCollection.findByIdAndDelete({
    _id: contactid,
  });

  return contact;
};
