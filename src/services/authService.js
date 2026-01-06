import { prisma } from "../../prisma/prisma.js";
import { hashPassword, verifyPassword } from "../../utils/password.js";
import { signAccessToken } from "../../utils/token.js";
import { HttpError } from "../../errors/customErrors.js";

const safeUser = (user) => ({
  id: user.id.toString(),          
  email: user.email,
  nickname: user.nickname,
  image: user.image ?? null,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const register = async ({ email, nickname, password }) => {
  const existsEmail = await prisma.user.findUnique({ where: { email } });
  if (existsEmail) throw new HttpError("이미 사용 중인 email입니다.", 409);

  const existsNick = await prisma.user.findUnique({ where: { nickname } });
  if (existsNick) throw new HttpError("이미 사용 중인 nickname입니다.", 409);

  const hashed = await hashPassword(password);

  const user = await prisma.user.create({
    data: { email, nickname, password: hashed },
  });

  const accessToken = signAccessToken({ userId: user.id.toString() });

  return { user: safeUser(user), accessToken };
};

export const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new HttpError("이메일 또는 비밀번호가 올바르지 않습니다.", 401);

  const ok = await verifyPassword(password, user.password);
  if (!ok) throw new HttpError("이메일 또는 비밀번호가 올바르지 않습니다.", 401);

  const accessToken = signAccessToken({ userId: user.id.toString() });

  return { user: safeUser(user), accessToken };
};
