// app.js (After - 모듈화)
import express from "express";
import articleRouter from "./routes/article.js";
import productRouter from "./routes/product.js";
import commentRouter from "./routes/comment.route.js";
import dotenv from "dotenv";
import uploadRouter from "./routes/upload.js";
import path from "path";
import cors from "cors";

dotenv.config();

const app = express();

const bigIntToStringOrBypass = (_, value) => {
  if (typeof value === "bigint") {
    return value.toString();
  }
  return value;
};

app.set("json spaces", 2);
app.use(express.json());
app.use("/api/articles", articleRouter);
app.use("/api/products", productRouter);
app.use("/api/comments", commentRouter);
app.use("/api/upload", uploadRouter);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use(cors());

app.get("/", (req, res) => {
  res.json({
    message: "API Server",
    endpoints: ["/articles", "/products"],
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
