import { registerUser } from '../services/auth';

export const registerUserController = async (req, res) => {
  const user = await registerUser(reg.body);
};
