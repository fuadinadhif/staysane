import { createLogger, format, transports } from "winston";
import path from "path";
import fs from "fs";

const logFormat = format.printf(({ timestamp, level, message }) => {
  return `[${timestamp}] [${level}]: ${message}`;
});

// Determine log directory based on environment
const isProd = process.env.NODE_ENV === "production";
const logDir = isProd ? "/tmp/logs" : path.resolve("logs");

// Ensure log directory exists (only for non-production or /tmp)
if (!isProd && !fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
} else if (isProd) {
  try {
    fs.mkdirSync(logDir, { recursive: true });
  } catch {
    // Ignore errors since /tmp may already exist or be unavailable briefly
  }
}

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DDTHH:mm:ss.SSSZ" }),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
    logFormat
  ),
  transports: [
    new transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
    }),
    new transports.File({
      filename: path.join(logDir, "combined.log"),
    }),
  ],
  exceptionHandlers: [
    new transports.File({
      filename: path.join(logDir, "exceptions.log"),
    }),
  ],
  rejectionHandlers: [
    new transports.File({
      filename: path.join(logDir, "rejections.log"),
    }),
  ],
});

// Add console logging in non-production environments
if (!isProd) {
  logger.add(
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        logFormat
      ),
    })
  );
}

export default logger;
