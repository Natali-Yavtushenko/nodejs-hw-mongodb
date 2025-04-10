import createHttpError from 'http-errors';
import mongoose from 'mongoose';

export const isValidId = (req, res, next) => {
  const id = req.params.contactId || req.params.id;
  console.log('Validating ID:', id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createHttpError(400, 'Invalid ID format');
  }

  next();
};
