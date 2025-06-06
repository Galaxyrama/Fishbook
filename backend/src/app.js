import express from "express";
import cors from "cors";
import session from "express-session";
import "dotenv/config";
import MongoStore from "connect-mongo";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const SESSION_SECRET = process.env.SESSION_SECRET;
const MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING;

app.use(express.json({ limit: "50mb" }));

app.use(
  session({
    name: "sid",
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: MONGO_CONNECTION_STRING,
      collectionName: "Sessions",
    }),
    cookie: {
      httpOnly: true,
      maxAge: 60 * 60 * 1000 * 24,
      sameSite: "lax",
    },
  })
);

app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);

export default app;
