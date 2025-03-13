import { UserCollection } from '../models/user';

export const registerUser = async (payload) => {
  return await UserCollection.create(payload);
};
