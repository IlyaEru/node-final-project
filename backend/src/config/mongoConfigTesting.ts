import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongo: any = undefined;

const setUpDb = async () => {
  mongo = await MongoMemoryServer.create();
  const url = mongo.getUri();

  mongoose.set('strictQuery', false);

  await mongoose.connect(url);
};

const dropDb = async () => {
  if (mongo) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongo.stop();
  }
};

const dropCollections = async () => {
  if (mongo) {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  }
};

export { setUpDb, dropDb, dropCollections };
