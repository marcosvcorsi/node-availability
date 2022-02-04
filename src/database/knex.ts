import { types } from "pg";
import knex from "knex";

const timestampOID = 1114;
types.setTypeParser(timestampOID, function (stringValue) {
  return stringValue;
});

const connection = knex({
  client: "pg",
  connection: process.env.DATABASE_URL,
});

export { connection };
