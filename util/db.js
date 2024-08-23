import { config } from "./config.js";
import knex from "knex";

const db = knex({
  client: "pg",
  connection: process.env.PG_CONNECTION_STRING,
  // connection: {
  //   host: config.POSTGRES_HOST,
  //   port: config.POSTGRES_PORT,
  //   user: config.POSTGRES_USER,
  //   password: config.POSTGRES_PASSWORD,
  //   database: config.POSTGRES_DATABASE,
  // },
});

export default db;
