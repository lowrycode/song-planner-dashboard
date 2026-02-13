export class SessionExpiredError extends Error {
  constructor() {
    super("Session expired");
    this.name = "SessionExpiredError";
  }
}

export class NetworkError extends Error {
  originalMessage?: string;

  constructor(message?: string) {
    super("Connection error. Please try again.");
    this.name = "NetworkError";
    this.originalMessage = message;
  }
}

export class ServerError extends Error {
  status: number;
  response?: Response;

  constructor(status: number, response?: Response, message?: string) {
    super(message || `Server error ${status}`);
    this.name = "ServerError";
    this.status = status;
    this.response = response;
  }
}

export class ClientError extends Error {
  status: number;
  response?: Response;

  constructor(status: number, response?: Response, message?: string) {
    super(message || `Client error ${status}`);
    this.name = "ClientError";
    this.status = status;
    this.response = response;
  }
}
