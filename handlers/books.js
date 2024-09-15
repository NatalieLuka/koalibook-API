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
  for (let i = 6; i >= 0; i--) {
    last7Days.push(dayjs().subtract(i, "day").format("YYYY-MM-DD"));
  }

  console.log("rawProgressRows", rawProgressRows);

  const rowsAfter = [];
  let pageBefore = 0;
  for (let row of rawProgressRows) {
    console.log("comp:", row.date, last7Days[0]);
    if (dayjs(row.date).isBefore(dayjs(last7Days[0]))) {
      pageBefore = row.current_page;
    } else {
      rowsAfter.push(row);
    }
  }

  console.log("rowsAfter", rowsAfter);

  let rowIndex = 0;
  let currentPage = pageBefore || 0;
  console.log("currentPage", currentPage);

  const weeklyProgress = last7Days.map((date) => {
    let pagesRead = 0;
    if (rowIndex < rowsAfter.length) {
      const match = dayjs(rowsAfter[rowIndex].date).isSame(dayjs(date), "day");
      if (match) {
        pagesRead = rowsAfter[rowIndex].current_page - currentPage;
        currentPage = rowsAfter[rowIndex].current_page;
        rowIndex++;
      }
    }
    return {
      currentPage,
      pagesRead,
      date,
      weekday: dayjs(date).format("ddd"),
    };
  });

  return { currentPage, weeklyProgress };
}

export async function getReadingProgress(req, res) {
  try {
    const userId = req.auth.claims.sub;
    console.log(userId);
    const { isbn } = req.params;
    const rows = await db(progressTableName)
      .where({
        user_id: userId,
        isbn,
      })
      .orderBy(["date"], "asc");
    const totalRows = await db(progressTableName)
      .where({
        user_id: userId,
      })
      .orderBy(["isbn", "date"], "asc");
    const { currentPage, weeklyProgress } = calculateWeeklyProgress(rows);

    const groupedTotalRows = totalRows.reduce((acc, cur) => {
      if (!acc[cur.isbn]) {
        return {
          ...acc,
          [cur.isbn]: [cur],
        };
      } else {
        return { ...acc, [cur.isbn]: [...acc[cur.isbn], cur] };
      }
    }, {});

    console.log(groupedTotalRows);
    const groupedWeeklyResults = [];

    for (const key of Object.keys(groupedTotalRows)) {
      groupedWeeklyResults.push(calculateWeeklyProgress(groupedTotalRows[key]));
    }

    console.log(JSON.stringify(groupedWeeklyResults));
    const totals = groupedWeeklyResults[0]?.weeklyProgress.slice() || [];
    for (let i = 1; i < groupedWeeklyResults.length; i++) {
      for (let j = 0; j < groupedWeeklyResults[i].weeklyProgress.length; j++) {
        totals[j].pagesRead +=
          groupedWeeklyResults[i].weeklyProgress[j].pagesRead;
      }
    }

    return res.json({
      isbn,
      currentPage,
      currentWeekProgress: weeklyProgress,
      totals: totals.map((item) => {
        const { currentPage, ...rest } = item;
        return {
          ...rest,
        };
      }),
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "server error" });
  }
}
