import { HttpError } from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  console.error('💥 ERROR:', err); // <== Обов'язково
  if (err instanceof HttpError) {
    res.status(err.status).json({
      status: err.status,
      message: err.name,
      data: err.stack,
    });
    return;
  }

  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    data: err.message,
  });
};
