import app from './app';

import connectDB from './config/mongoConfig';

// connect to database
connectDB();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
