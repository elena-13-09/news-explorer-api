const {
  NODE_ENV,
  JWT_SECRET,
  SERVER_PORT,
  SERVER_HOST,
} = process.env;

const SECRET_STR = NODE_ENV === 'production' && JWT_SECRET ? JWT_SECRET : 'dev-secret';
const PORT = NODE_ENV === 'production' && SERVER_PORT ? SERVER_PORT : 4000;
const SERVER_DB = NODE_ENV === 'production' && SERVER_HOST ? SERVER_HOST : 'mongodb://localhost:27017/diplomadb';

module.exports = {
  SECRET_STR,
  SERVER_DB,
  PORT,
};
