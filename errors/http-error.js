/**
 * This class throws an HTTP error
 *
 * Stores statusCode and message
 *
 * @type {module.HttpError}
 */
module.exports = class HttpError extends Error {
  constructor (message, statusCode) {

    // Calling parent constructor of base Error class.
    super(message);

    // Saving class name in the property of our custom error as a shortcut.
    this.name = this.constructor.name;

    // Capturing stack trace, excluding constructor call from it.
    Error.captureStackTrace(this, this.constructor);

    this.statusCode = statusCode || 500;
  }
};
