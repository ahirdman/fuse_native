interface AuthErrorArgs {
  status?: number | undefined;
  message: string;
}

export class AuthError {
  public readonly status?: number | undefined;
  public readonly message: string;

  constructor({ status, message }: AuthErrorArgs) {
    this.status = status;
    this.message = message;
  }

  toJSON() {
    return {
      error: {
        status: this.status,
        data: {
          message: this.message,
        },
      },
    };
  }
}
