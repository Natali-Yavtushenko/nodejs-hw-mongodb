import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';

export const isValidId = (req, res, next) => {
  const { contactid } = req.params;
  if (!isValidObjectId(contactid)) {
    throw createHttpError(400, 'Bad Request');
  }
  next();
};
