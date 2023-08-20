import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'express-validator';
import { createSubLogger } from '../logger';

const logger = createSubLogger('httpError');

export class HttpError extends Error {
  constructor(
    message: string,
    public readonly status: number = 500,
  ) {
    super(message);
  }
}

export class HttpAuthUnauthorizedError extends HttpError {
  constructor(message: string) {
    super(message, 401);
  }
}

export class HttpAuthForbiddenError extends HttpError {
  constructor(message: string) {
    super(message, 403);
  }
}

export class HttpBadRequest extends HttpError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class HttpValidationError extends HttpError {
  constructor(public readonly errors: ValidationError[]) {
    super('validation failed', 422);
  }
}

export class HttpResourceNotFound extends HttpError {
  constructor(message: string) {
    super(message, 404);
  }
}

export class HttpResourceAlreadyExists extends HttpError {
  constructor(message: string) {
    super(message, 409);
  }
}

export class FakeopolyError extends Error {
  constructor(
    message: string,
    public readonly success: boolean = false,
  ) {
    super(message);
  }
}

export function endpointNotFound(req: Request, res: Response) {
  res.format({
    'text/html': () => res.status(404).send(`<html lang="en"><h1>Error 404: Endpoint not found</h1></html>`),
    'application/json': () => {
      throw new HttpResourceNotFound('Endpoint not found');
    },
  });
}

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  let statusCode = undefined;
  let errorMsg;
  let success = undefined;

  if (err.success != null) {
    success = err.success;
    errorMsg = err.message;
  } else {
    statusCode = err.status || 500;
    errorMsg = err.message || 'Internal Server Error';
    if (statusCode === 500) {
      logger.error(err, { errorMsg, statusCode });
    } else {
      logger.warn(err, { errorMsg, statusCode });
    }
  }

  // handle partial message already sent error with default handler
  if (res.headersSent) {
    return next(err);
  }

  return res.status(statusCode || 200).json({
    success: success,
    message: errorMsg,
    status: statusCode,
    errors: err?.errors, // for validation errors only
  });
}
