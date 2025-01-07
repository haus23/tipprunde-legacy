export class ValidationError extends Error {
  status: number;
  errorDescription: string;

  constructor(opts: { statusCode: number; error: string }) {
    super();
    this.status = opts.statusCode;
    this.errorDescription = opts.error;
  }
}
