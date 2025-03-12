import { SORT_ORDER } from '../constants/index.js';

const parseSortOrder = (sortOrder) => {
  const isKnownOrder = [SORT_ORDER.ASC, SORT_ORDER.DESC].includes(sortOrder);
  if (isKnownOrder) return sortOrder;
  return SORT_ORDER.ASC;
};

const parseSortBy = (sortBy) => {
  if (!sortBy) {
    console.warn("⚠️ Отримано некоректний sortBy, використовую '_id'");
    return '_id';
  }
  const keysOfContact = [
    'id',
    'name',
    'phoneNumber',
    'email',
    'contactType',
    'createdAt',
    'updatedAt',
  ];

  if (keysOfContact.includes(sortBy)) {
    return sortBy;
  }

  console.warn(`⚠️ Невідомий sortBy: ${sortBy}, використовую '_id'`);
  return '_id';
};

export const parseSortParams = (query) => {
  console.log('🔍 Вхідні параметри:', query); // Додано для дебагу
  const { sortOrder, sortBy } = query;

  const parsedSortOrder = parseSortOrder(sortOrder);
  const parsedSortBy = parseSortBy(sortBy);
  console.log('✅ Оброблені параметри сортування:', {
    sortBy,
    parsedSortBy,
    parsedSortOrder,
  });
  return {
    sortOrder: parsedSortOrder,
    sortBy: parsedSortBy,
  };
};
