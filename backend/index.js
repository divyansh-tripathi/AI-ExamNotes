import express from "express";
import dotenv from "dotenv";
import connectDb from "./utils/connectDb.js";
import authRouter from "./routes/auth.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import notesRouter from "./routes/generate.route.js";
import pdfRouter from "./routes/pdf.route.js";
import creditRouter from "./routes/credits.route.js";
import { stripeWebhook } from "./controllers/credits.controller.js";
dotenv.config();

const app = express();
app.post(
  "/api/credits/webhook",
  express.raw({type:"application/json"}),
  stripeWebhook
)
app.use(
  cors({
    origin: "https://ai-examnotesclient.onrender.com"|| "http://localhost:5173",
    credentials: true,
    methods: ["GET", "PUT", "DELETE", "POST", "OPTIONS"],
  }),
);






app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.json({ message: "Ai Notes Server is running" });
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/notes", notesRouter);
app.use("/api/pdf", pdfRouter);
app.use("/api/credit", creditRouter);

app.listen(PORT, (err) => {
  if (err) {
    console.log("Something went wrong ", err);
  }
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDb();
});
