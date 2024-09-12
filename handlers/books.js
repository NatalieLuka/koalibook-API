import { text } from "express";
import { config } from "../util/config.js";
import db from "../util/db.js";
import dayjs from "dayjs";

const booksTableName = config.DB_TABLE_NAME_PREFIX + "books";
const progressTableName = config.DB_TABLE_NAME_PREFIX + "progress";

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

export async function addReadingProgress(req, res) {
  try {
    const userId = req.auth.claims.sub;
    const { isbn } = req.params;
    const { newPage, date } = req.body;
    if (!newPage || isNaN(newPage)) {
      return res.status(400).json({
        msg: "newPage is missing or not a number",
      });
    }
    await db(progressTableName)
      .insert({
        user_id: userId,
        isbn,
        current_page: newPage,
        date,
      })
      .onConflict(["user_id", "isbn", "date"])
      .merge();
    return res.json({ msg: "ok" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "server error" });
  }
}

function calculateWeeklyProgress(rawProgressRows) {
  const last7Days = [];
  for (let i = 0; i < 7; i++) {
    last7Days.push(dayjs().subtract(i, "day").format("YYYY-MM-DD"));
  }
  let rowIndex = 0;
  let currentPage = 0;
  const weeklyProgress = last7Days.map((date) => {
    if (
      rowIndex < rawProgressRows.length &&
      dayjs(rawProgressRows[rowIndex].date).isSame(dayjs(date), "day")
    ) {
      const { current_page } = rawProgressRows[rowIndex];
      rowIndex++;
      currentPage = rawProgressRows[rowIndex]?.current_page || 0;
      return {
        currentPage: current_page,
        date,
        weekday: dayjs(date).format("ddd"),
      };
    }
    return {
      currentPage,
      date,
      weekday: dayjs(date).format("ddd"),
    };
  });
  const result = weeklyProgress.reverse().map((item) => {
    const { current_page, ...rest } = item;
    const r = {
      ...rest,
      currentPage: item.currentPage || currentPage,
      pagesRead: item.currentPage ? item.currentPage - currentPage : 0,
    };
    currentPage = r.currentPage;
    return r;
  });
  return { currentPage, weeklyProgress: result };
}

export async function getReadingProgress(req, res) {
  try {
    const userId = req.auth.claims.sub;
    const { isbn } = req.params;
    const rows = await db(progressTableName)
      .where({
        user_id: userId,
        isbn,
      })
      .orderBy("date", "desc");
    const totalRows = await db(progressTableName)
      .where({
        user_id: userId,
      })
      .orderBy("date", "desc");
    let { currentPage, weeklyProgress } = calculateWeeklyProgress(rows);
    let { currentPage: _, weeklyProgress: totalWeekProgress } =
      calculateWeeklyProgress(totalRows);

    return res.json({
      isbn,
      currentPage,
      currentWeekProgress: weeklyProgress,
      totalWeekProgress,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "server error" });
  }
}
