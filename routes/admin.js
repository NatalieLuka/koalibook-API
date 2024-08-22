import express from "express";
import { resetDb } from "../handlers/admin.js";

const router = express.Router();

router.post("/resetdb", resetDb);

export default router;
