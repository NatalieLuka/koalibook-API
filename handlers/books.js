import { text } from "express";
import { config } from "../util/config.js";
import db from "../util/db.js";

const booksTableName = config.DB_TABLE_NAME_PREFIX + "books";

export async function getBooks(req, res) {
  try {
    // console.log(req.auth.claims.sub);
    const userId = req.auth.claims.sub;
    const books = await db(booksTableName).where({
      user_id: userId,
    });
    return res.json(
      books.map((book) => {
        const {
          page_count: pageCount,
          user_id,
          text_snippet: textSnippet,
          ...rest
        } = book;
        return {
          ...rest,
          pageCount,
          textSnippet,
        };
      })
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "server error" });
  }
}

export async function getBook(req, res) {
  // console.log({ req });
  try {
    const userId = req.auth.claims.sub;
    const [book] = await db(booksTableName).where({
      user_id: userId,
      isbn: req.params.isbn,
    });
    // console.log({ book });
    if (!book) {
      return res.status(404).json({ msg: "book not found" });
    }
    const {
      page_count: pageCount,
      user_id,
      text_snippet: textSnippet,
      ...rest
    } = book;
    const result = {
      ...rest,
      pageCount,
      textSnippet,
    };
    console.debug("getBook - response:", result);
    return res.json(result);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "server error" });
  }
}

export async function addBook(req, res) {
  console.debug("addBook - request body:", req.body);
  try {
    const { isbn, title, author, pageCount, description, textSnippet, image } =
      req.body;
    if (!isbn || !title) {
      return res.status(400).json({ msg: "isbn and title are required" });
    }
    if (!Number.isInteger(pageCount)) {
      return res
        .status(400)
        .json({ msg: "pageCount must be an integer number" });
    }
    const userId = req.auth.claims.sub;

    const [newBook] = await db(booksTableName).returning("*").insert({
      user_id: userId,
      isbn,
      title,
      author,
      page_count: pageCount,
      description,
      text_snippet: textSnippet,
      image,
    });

    const { page_count, user_id, text_snippet, ...rest } = newBook;
    // console.log({
    //   ...rest,
    //   pageCount: page_count,
    //   textSnippet: text_snippet,
    // });
    return res.json({
      ...rest,
      pageCount: page_count,
      textSnippet: text_snippet,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "server error" });
  }
}

export async function deleteBook(req, res) {
  // console.log({ req });
  try {
    const userId = req.auth.claims.sub;
    const affectedRows = await db(booksTableName)
      .where({
        user_id: userId,
        isbn: req.params.isbn,
      })
      .returning("*")
      .delete();
    // console.log({ affectedRows });
    if (affectedRows.length === 0) {
      return res.status(404).json({ msg: "book not found" });
    }
    return res.json({
      affectedRows,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "server error" });
  }
}
