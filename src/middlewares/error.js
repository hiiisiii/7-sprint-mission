import { Prisma } from "@prisma/client";
import { HttpError } from "../../errors/customErrors.js"; 

export const errorMiddleware = (err, req, res, next) => {
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      const target = Array.isArray(err.meta?.target)
        ? err.meta.target.join(", ")
        : "unique field";
      return res.status(409).json({ message: `${target} 값이 이미 존재합니다.` });
    }

    if (err.code === "P2025") {
      return res.status(404).json({ message: "리소스를 찾을 수 없습니다." });
    }
  }

  return res.status(500).json({ message: "Internal Server Error" });
};
