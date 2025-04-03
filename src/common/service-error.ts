export class ServiceError extends Error {
  public readonly code: string;
  public readonly cause?: Error;

  constructor(message: string, options?: ServiceErrorOptions) {
    super(message);

    this.name = this.constructor.name;
    this.code = options?.code ?? `Unknown ${this.constructor.name}`;
    this.cause = options?.cause;

    Error.captureStackTrace(this, this.constructor);
  }

  public toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      stack: this.stack,
      cause: this.cause instanceof Error ? `${this.cause.name}: ${this.cause.message}` : this.cause,
    };
  }

  public toString(): string {
    const cause = this.cause instanceof Error ? `[Caused by: ${this.cause.name}: ${this.cause.message}]` : '';

    return `${this.name}[${this.code}]: ${this.message} ${cause}`.trim();
  }
}

export interface ServiceErrorOptions {
  code: string;
  cause?: Error;
}
