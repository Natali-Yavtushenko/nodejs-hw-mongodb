import nodemailer from 'nodemailer';

import { SMTP } from '../constants/index.js';
import { getEnvVar } from '../utils/getEnvVar.js';
console.log('SMTP_HOST:', getEnvVar(SMTP.SMTP_HOST));
console.log('SMTP_USER:', getEnvVar(SMTP.SMTP_USER));
console.log('SMTP_PASSWORD:', getEnvVar(SMTP.SMTP_PASSWORD));
const transporter = nodemailer.createTransport({
  host: getEnvVar(SMTP.SMTP_HOST),
  port: Number(getEnvVar(SMTP.SMTP_PORT)),
  auth: {
    user: getEnvVar(SMTP.SMTP_USER),
    pass: getEnvVar(SMTP.SMTP_PASSWORD),
  },
});

export const sendEmail = async (options) => {
  return await transporter.sendMail(options);
};
