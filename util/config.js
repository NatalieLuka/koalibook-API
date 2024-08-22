import dotenv from "dotenv";
dotenv.config();

const {
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DATABASE,
  DB_TABLE_NAME_PREFIX = "campus",
  PORT = 3000,
} = process.env;

console.log(POSTGRES_HOST);

export const config = {
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DATABASE,
  DB_TABLE_NAME_PREFIX: DB_TABLE_NAME_PREFIX + "-",
  PORT,
};
