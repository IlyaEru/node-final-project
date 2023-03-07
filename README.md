# Factory Management Web Application

This is a web application for managing a factory's employees, departments, and shifts.


## Description

The purpose of the web site is to provide a management system for a factory. It allows registered users to log in and perform various actions, such as creating and editing employees and departments, creating and allocating shifts, and viewing user data. The site uses Node.JS and MongoDB on the server side, and React with Redux on the front-end. The site also implements JWT-based authentication to ensure only registered users can access the system, and tracks user actions to enforce a maximum number of actions per day.


https://user-images.githubusercontent.com/95101177/223373020-d6f5dc7c-7e68-4063-b47d-faf369128da0.mp4


## Built With

#### General

- Typescript - for type checking
- Joi - for input validation
- Dayjs - for date and time manipulation
- Eslint - for linting

#### Server

- Node.JS - for server-side logic
- Express - for routing
- MongoDB - for data storage
- Mongoose - for data modeling
- jsonwebtoken - for authentication
- Bcrypt - for password hashing
- Helmet - for security
- Morgan - for logging
- Dotenv - for environment variables
- Nodemon - for development
- Jest, mongoose-memory-server, supertest - for testing

#### Client

- React - for front-end logic
- Redux + Redux Toolkit - for state management
- Redux Toolkit Query - for data fetching, caching, and invalidation
- Redux persist - for persisting state to local storage
- React Router - for routing
- Vite - for bundling
- Styled Components - for styling

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/IlyaEru/node-final-project.git
   ```
2. Install NPM packages

```sh
npm install
```

or

```sh
yarn install
```

or (my recommendation)

```sh
pnpm install
```

3. Create a .env file in the backend directory of the project with yours environment variables, like the .env.template file

4. Run the project

```sh
npm start
```

or for development

```sh
npm run dev
```
