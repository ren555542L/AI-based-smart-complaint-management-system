/**
 * Global Error Handler Middleware.
 * Catches all errors thrown in route handlers and sends a uniform response.
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || res.statusCode === 200 ? 500 : res.statusCode;

  console.error(`[ERROR] ${err.message}`);

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    // Only show stack trace in development
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

/**
 * 404 Not Found Middleware.
 * Handles requests to undefined routes.
 */
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

module.exports = { errorHandler, notFound };
