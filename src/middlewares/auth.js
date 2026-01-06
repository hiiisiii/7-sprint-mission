import { verifyAccessToken } from "../../utils/token.js";
import { HttpError } from "../../errors/customErrors.js";

export const auth = (req, res, next) => {
  const header = req.headers.authorization;
 
  if (!header?.startsWith("Bearer ")) {
    throw new HttpError("인증이 필요합니다.", 401);
  }

  const token = header.slice("Bearer ".length);

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: BigInt(payload.userId) };
    next();
  } catch {
    throw new HttpError("유효하지 않은 토큰입니다.", 401);
  }
};
