# Tasks-Manager-App :clipboard:

## Description :page_facing_up:

a back-end web application allowing users to use CRUD operations on tasks database which implemented with _role-based access control_. The application is built using **typescript, node.js, express, and mongodb**. The app also has its own **dockerfile** to ease the deployment. Lastly, the app is builtin with automation testing using **jest** and **supertest** for code quality assurance.

## Key Features :pushpin:

- **User Authentication**: Allow users to sign up, log in, and manage their profiles securely.

- **User CRUD Operations**: Implement functionality for users to create, read, update, and delete accounts.

- **Role-Based Access Control**: Implement role-based access control to restrict access to certain routes.

- **Sorted Tasks**: Allow users to sort tasks based on query parameters. -> date, user_id, task_id, status, and priority.

## Technologies :computer:

**Backend**: Node.js with Express

**Database**: MongoDB (Atlas)

**Database Connection**: Mongoose

**Authentication**: Implement secure authentication using JWT token sent through cookies

**Deployment**: Docker through dockerfile

## Environment Variables :deciduous_tree:

The following variables are required to run the program.

- `PORT` : the port number for the server
- `USER` : the username for the database
- `PASSWORD` : the password for the database
- `SECRET` : the secret key for the JWT token

`USER`, `PORT`, and `PASSWORD` can be obtained from your local configuration.
`SECRET` can be generated on your own choosing.

## Testing :telescope:

To run the tests, run the following command in the terminal:
`npm run test`
