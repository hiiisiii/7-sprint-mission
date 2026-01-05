import { verifyAccessToken } from "../../utils/token.js";

export const auth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return res.status(401).json({ message: "Unauthorized" });

  const token = header.slice("Bearer ".length);
  try {
    const payload = verifyAccessToken(token);
    req.user = { id: BigInt(payload.userId) };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};
