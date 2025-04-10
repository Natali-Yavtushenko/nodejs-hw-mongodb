import { randomBytes } from 'crypto';
import bcrypt from 'bcrypt';
import path from 'node:path';
import jwt from 'jsonwebtoken';
import fs from 'node:fs/promises';
import handlebars from 'handlebars';

import { SMTP, TEMPLATES_DIR } from '../constants/index.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { sendEmail } from '../utils/sendMail.js';

import createHttpError from 'http-errors';
import UsersCollection from '../db/models/user.js';

import { FIFTEEN_MINUTES, THIRTY_DAYS } from '../constants/index.js';
import { SessionsCollection } from '../db/models/session.js';
import { loginUser, registerUser } from '../services/auth.js';

export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutUserController = async (sessionId) => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  };
};

export const refreshUserSessionController = async ({
  sessionId,
  refreshToken,
}) => {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isExpired = new Date() > new Date(session.refreshTokenValidUntil);
  if (isExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  const newSession = createSession();
  await SessionsCollection.deleteOne({ _id: sessionId, refreshToken });

  return await SessionsCollection.create({
    userId: session.userId,
    ...newSession,
  });
};

export const requestResetEmailController = async (req, res, next) => {
  try {
    console.log('Incoming email:', req.body.email); // DEBUG
    await requestResetToken(req.body.email);
    res.json({
      message: 'Reset password email has been successfully sent!',
      status: 200,
      data: {},
    });
  } catch (error) {
    console.error('Error in requestResetEmailController:', error.message);
    next(error);
  }
};

export const resetPasswordController = async (req, res, next) => {
  try {
    await resetPassword(req.body);
    res.json({
      message: 'Password has been successfully reset!',
      status: 200,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

export const requestResetToken = async (email) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    getEnvVar('JWT_SECRET'),
    {
      expiresIn: '15m',
    },
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );

  try {
    const templateSource = await fs.readFile(
      resetPasswordTemplatePath,
      'utf-8',
    );
    const template = handlebars.compile(templateSource);

    const html = template({
      name: user.name,
      link: `${getEnvVar('APP_DOMAIN')}/reset-pwd?token=${resetToken}`,
    });

    await sendEmail({
      from: getEnvVar(SMTP.SMTP_FROM),
      to: email,
      subject: 'Reset your password',
      html,
    });
  } catch (error) {
    console.error('Email template/send error:', error);
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

export const resetPassword = async (payload) => {
  if (!payload.password || payload.password.length < 6) {
    throw createHttpError(400, 'Password must be at least 6 characters long');
  }

  let entries;

  try {
    entries = jwt.verify(payload.token, getEnvVar('JWT_SECRET'));
  } catch (err) {
    throw createHttpError(401, err.message);
  }

  const user = await UsersCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await UsersCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );
};
