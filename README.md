# Demo Socket.io

This is the backend and front end of the Demo Socket.io project.

## Installation

Run `npm i` to install all the packages for the project. Current node version in use: v18.2.0

## Usage

### Environment variables

Please check the file `.env.example` file to create the local `.env` file to run the server.
The database config will be based on the the environment variable `NODE_ENV`.

Required environment variables to run the server are:

- `APP_HOST`, host connect to application
- `APP_PORT`, port connect to application

### Development

Run `npm run start` to spin up the development environment. The default endpoint will be `http://localhost:3000`.
