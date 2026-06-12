import { ApiError } from "../utils/ApiError.js";

const errorMiddleware = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.code).json(err.toJSON());
  }

  return res.status(500).json({
    status: false,
    code: 500,
    data: "Error",
    message: err?.message || "Internal Server Error",
    errors: [],
  });
};

export { errorMiddleware };
