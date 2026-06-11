const successResponse = (res, message, data = null, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    statusCode,
    message,
    data,
    error: null,
    timestamp: new Date().toISOString(),
  });
};

const errorResponse = (res, message, error = null, statusCode = 400) => {
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    data: null,
    error,
    timestamp: new Date().toISOString(),
  });
};

export { successResponse, errorResponse };
