import mongoose from 'mongoose';

const DB_URL =
  'mongodb+srv://yavtushenkon:N1915757n@cluster0.fimle.mongodb.net/contacts?retryWrites=true&w=majority&appName=Cluster0';

export const initMongoConnection = async () => {
  return mongoose.connect(DB_URL);
};
console.log('Mongo connection successfully established!');
