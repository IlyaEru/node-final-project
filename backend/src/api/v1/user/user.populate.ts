import User from './user.model';
import connectDb from '../../../config/mongoConfig';

// Populates users with users from the https://jsonplaceholder.typicode.com/users
// API.
const url = 'https://jsonplaceholder.typicode.com/users';
export const populateUsers = async () => {
  await connectDb();
  try {
    const response = await fetch(url);
    const users = await response.json();
    const formattedUsers = users.map((user: any) => ({
      username: user.username,
      email: user.email,
      fullName: user.name,
    }));
    await User.deleteMany({});
    await User.insertMany(formattedUsers);
  } catch (error: any) {
    console.log(error);
  }
};

populateUsers();
