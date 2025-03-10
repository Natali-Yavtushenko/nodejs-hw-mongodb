import { HttpError } from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  console.error('🚨 Error occurred:', err.message); // Виводимо повідомлення помилки
  console.error('🔍 Stack trace:', err.stack); // Виводимо стек помилки
  if (err instanceof HttpError) {
    res.status(err.status).json({
      status: err.status,
      message: err.name,
      data: err,
    });
    return;
  }

  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    data: err.message,
  });
};
