import Joi from 'joi';

export const createContactsSchema = Joi.object({
  name: Joi.string().min(3).max(18).required(),
  phoneNumber: Joi.string().min(7).max(16).required(),
  email: Joi.string(),
  contactType: Joi.string().valid('work', 'home', 'personal').required(),
});

export const updateContactsSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.number().min(7).max(16),
  email: Joi.string(),
  contactType: Joi.string().valid('work', 'home', 'personal'),
});
