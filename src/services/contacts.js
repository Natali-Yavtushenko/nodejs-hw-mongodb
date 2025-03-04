import ContactCollection from '../models/contact.js';

export const getAllContacts = async () => {
  const contacts = await ContactCollection.find();
};

export const getContactById = async (contactid) => {
  const contact = await ContactCollection.findById(contactid);
};

export const createContact = async (payload) => {
  const contact = await ContactCollection.create(payload);
  return contact;
};
