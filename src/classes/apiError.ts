export class APIError extends Error {
    public statusCode?: number;
    public response?: unknown;

    public prefix?: string;
    public originMessage: string;

    constructor(message: string, prefix?: string, statusCode?: number, response?: unknown) {
        super(`${prefix ? `[${prefix}] ` : ""}[ERROR ${statusCode}]: ${message}`);

        this.name = "APIError";

        this.originMessage = message;
        this.statusCode = statusCode;

        this.prefix = prefix;
        this.response = response;
    }
}