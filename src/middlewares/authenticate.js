import createHttpError from 'http-errors';
import { SessionsCollection } from '../models/session.js';
import UsersCollection from '../models/user.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.get('Authorization');
  const { sessionId } = req.cookies;

  if (!authHeader && !sessionId) {
    return next(
      createHttpError(401, 'Authorization header or sessionId missing'),
    );
  }

  let session;

  if (authHeader) {
    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      return next(createHttpError(401, 'Invalid token format'));
    }

    session = await SessionsCollection.findOne({ accessToken: token });
  } else if (sessionId) {
    session = await SessionsCollection.findById(sessionId);
  }

  if (!session || !session.isActive) {
    return next(createHttpError(401, 'Session not found or inactive'));
  }

  if (new Date() > new Date(session.accessTokenValidUntil)) {
    return next(createHttpError(401, 'Access token expired'));
  }

  const user = await UsersCollection.findById(session.userId);

  if (!user) {
    return next(createHttpError(401, 'User not found'));
  }

  req.user = user;
  req.session = session;

  next();
};
