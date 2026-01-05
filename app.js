import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import articleRouter from "./src/routers/articleRouter.js";
import productRouter from "./src/routers/productRouter.js";
import commentRouter from "./src/routers/commentRouter.js";
import uploadRouter from "./src/routers/uploadRouter.js";
import { errorMiddleware } from "./src/middlewares/error.js";

dotenv.config();

const app = express();

app.set("json replacer", (_, value) =>
  typeof value === "bigint" ? value.toString() : value
);

app.set("json spaces", 2);
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api/articles", articleRouter);
app.use("/api/products", productRouter);
app.use("/api/comments", commentRouter);
app.use("/api/upload", uploadRouter);

app.get("/", (req, res) => {
  res.json({
    message: "API Server",
    endpoints: [
      "/api/articles",
      "/api/products",
      "/api/comments",
      "/api/upload/image",
    ],
  });
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
