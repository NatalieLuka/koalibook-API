import express from "express";
import { getBooks, getBook, addBook } from "../handlers/books.js";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

const router = express.Router();

router.get("/", ClerkExpressRequireAuth(), getBooks);
router.get("/:isbn", ClerkExpressRequireAuth(), getBook);
router.post("/", ClerkExpressRequireAuth(), addBook);

export default router;
