# Bank Software Server
Server for a bank-software, using node as backEnd and Sequelize as our ORM

## Installing

### The first step is clonning the repository
`git clone https://github.com/Fxhnd13/bank-software-server` -> we need to be in the dev/test branch, where all the code is.

### Installing dependencies
`npm install`

### Running the server
`npm run dev` -> if we need to prove some changes
`node source/index.js` -> if we need only put our server on

### Maping database
Using postman or insomnia, we can send request to our server, if we execute a POST request to http://<server-ip>:3000/db, then a function will execute,
  this function will drop all tables (if-exist) and bulk some data into it. **NOTE: We need to already create the database bank_server in postgresql**.
  We can change de database connection credentials in source/db/credentials.js
