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

// Body-Parser Middleware, um JSON-Body zu parsen

app.use(express.json());

// Interceptor Middleware für alle Requests

// Interceptor Middleware für alle Requests
app.use((req, res, next) => {
  // Logge die Request-Header und Body
  // console.log("Request Headers:", req.headers);
  // console.log("Request Body:", req.body);

  // Überschreibe die res.send Methode, um den Response abzufangen
  const originalSend = res.send;

  // Hook die res.send Funktion
  res.send = function (body) {
    // Logge den Response-Body
    // console.log("Response Body:", body);

    // Rufe die Original send Methode auf
    return originalSend.apply(this, arguments);
  };

  // Fahre mit der nächsten Middleware oder Route fort
  next();
});

const server = app.listen(PORT, () =>
  console.log(`books api listening on port ${PORT}!`)
);

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
