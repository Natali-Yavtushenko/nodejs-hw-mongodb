import pach from 'node:path';
import fs from 'node:fs/promises';

import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from '../constants/index.js';
import { getEnvVar } from './getEnvVar.js';

export const saveFileToUploadDir = async (file) => {
  await fs.rename(
    pach.join(TEMP_UPLOAD_DIR, file.filename),
    pach.join(UPLOAD_DIR, file.filename),
  );
  return `${getEnvVar('APP_DOMAIN')}/uploads/${file.filename}`;
};
