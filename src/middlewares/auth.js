import { verifyAccessToken } from "../../utils/token.js";
import { HttpError } from "../../errors/customErrors.js";

export const auth = (req, res, next) => {
  const header = req.headers.authorization;
 
  if (!header?.startsWith("Bearer ")) {
    throw new HttpError("Unauthorized", 401);
  }

  const token = header.slice("Bearer ".length);

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: BigInt(payload.userId) };
    next();
  } catch {
    throw new HttpError("Invalid token", 401);
  }
};
