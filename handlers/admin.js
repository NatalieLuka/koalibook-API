import { config } from "../util/config.js";
import db from "../util/db.js";
const { DB_TABLE_NAME_PREFIX } = config;

export async function resetDb(_, res) {
  const booksTableName = DB_TABLE_NAME_PREFIX + "books";
  try {
    await db.schema.dropTableIfExists(booksTableName);
    await db.schema.createTable(booksTableName, (table) => {
      table.string("user_id");
      table.string("isbn");
      table.string("title");
      table.string("author");
      table.mediumint("page_count");
      table.string("description", 2000);
      table.string("text_snippet", 2000);
      table.primary(["user_id", "isbn"]);
    });
    res.json({ msg: "db reset successful" });
  } catch (err) {
    console.error(err);
    res.json({
      msg: "db reset failed",
    });
  }
}
