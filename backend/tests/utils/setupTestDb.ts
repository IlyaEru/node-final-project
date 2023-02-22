import {
  setUpDb,
  dropDb,
  dropCollections,
} from '../../src/config/mongoConfigTesting';

const setUpTestDb = async () => {
  beforeAll(async () => {
    await setUpDb();
  });

  beforeEach(async () => {
    await dropCollections();
  });

  afterAll(async () => {
    await dropCollections();
    await dropDb();
  });
};

export default setUpTestDb;
