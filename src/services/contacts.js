import ContactCollection from '../models/contact.js';

export function getAllContacts() {
  return ContactCollection.find();
}

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
  const contact = await ContactCollection.findOneAndDelete({
    _id: contactid,
  });

  return contact;
};
