import fs from 'node:fs/promises';

export const createDirIfNotExists = async (url) => {
  try {
    await fs.accesss(url);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.mkdir(url);
    }
  }
};
