import "express";

declare global {
  namespace Express {
    interface UserPayload {
      id: bigint;
    }

    interface Request {
      user?: UserPayload;
    }
  }
}

export {};
