import Joi from 'joi';
const { number } = Joi;

const parsecontactType = (contactType) => {
  const isString = typeof contactType === 'string';
  if (!isString) return;
  const iscontactType = (contactType) =>
    ['work', 'home', 'personal'].includes(contactType);

  if (iscontactType(contactType)) return contactType;
};

const parseNumber = (number) => {
  const isString = typeof number === 'string';
  if (!isString) return;

  const parsedNumber = parseInt(number);
  if (Number.isNaN(parsedNumber)) {
    return;
  }

  return parsedNumber;
};
export const parseFilterParams = (query) => {
  const { contactType, maxphoneNumber, minphoneNumber } = query;

  const parsedcontactType = parsecontactType(contactType);
  const parsedMaxphoneNumber = parseNumber(maxphoneNumber);
  const parsedMinphoneNumber = parseNumber(minphoneNumber);

  return {
    contactType: parsedcontactType,
    maxphoneNumber: parsedMaxphoneNumber,
    minphoneNumber: parsedMinphoneNumber,
  };
};
