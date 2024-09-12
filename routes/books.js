import express from "express";
import {
  getBooks,
  getBook,
  addBook,
  deleteBook,
  getReadingProgress,
  addReadingProgress,
} from "../handlers/books.js";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

const mockRequireAuth = () => {
  return (req, res, next) => {
    req.auth = {
      claims: {
        sub: "user_2kvS4TlscobKCbSy0eYO4IiAbZE",
      },
    };
    next();
  };
};

// const requireAuth = mockRequireAuth;
const requireAuth =
  process.env.AUTH === "mock" ? mockRequireAuth : ClerkExpressRequireAuth;

const router = express.Router();

router.get("/", requireAuth(), getBooks);
router.post("/", requireAuth(), addBook);
router.get("/:isbn", requireAuth(), getBook);
router.get("/:isbn/progress", requireAuth(), getReadingProgress);
router.post("/:isbn/progress", requireAuth(), addReadingProgress);
router.delete("/:isbn", requireAuth(), deleteBook);

export default router;
