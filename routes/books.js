import express from "express";
import { getBooks, getBook, addBook, deleteBook } from "../handlers/books.js";
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

const router = express.Router();

// comment these lines to bypass Clerk authentication

router.get("/", ClerkExpressRequireAuth(), getBooks);
router.get("/:isbn", ClerkExpressRequireAuth(), getBook);
router.post("/", ClerkExpressRequireAuth(), addBook);
router.delete("/:isbn", ClerkExpressRequireAuth(), deleteBook);

// uncomment these lines to bypass Clerk authentication

// router.get("/", mockRequireAuth(), getBooks);
// router.get("/:isbn", mockRequireAuth(), getBook);
// router.post("/", mockRequireAuth(), addBook);

export default router;
