import { config } from "./util/config.js";
import express from "express";
import cors from "cors";
import booksRoutes from "./routes/books.js";
import adminRoutes from "./routes/admin.js";
import { resetDb } from "./handlers/admin.js";
import bodyParser from "body-parser";

const { PORT } = config;

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    msg: "books api",
  });
});

app.use("/books", booksRoutes);
app.use("/admin", adminRoutes);

// admin routes

const server = app.listen(PORT, () =>
  console.log(`books api listening on port ${PORT}!`)
);

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
