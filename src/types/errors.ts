export class SessionExpiredError extends Error {
  constructor() {
    super("Session expired");
    this.name = "SessionExpiredError";
  }
}

export class NetworkError extends Error {}

export class ServerError extends Error {
  status: number;
  constructor(status: number, message?: string) {
    super(message || `Server error ${status}`);
    this.status = status;
  }
}

export class ClientError extends Error {
  status: number;
  constructor(status: number, message?: string) {
    super(message || `Client error ${status}`);
    this.status = status;
  }
}
