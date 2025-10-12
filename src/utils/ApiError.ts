class ApiError extends Error {
    public readonly statusCode: number;
    public readonly errors: string[] | null;
    public readonly data: unknown;
    public readonly success: boolean;

    constructor(
        statusCode: number,
        message = "something went wrong",
        errors: string[] | null = null,
        data: unknown = null,
        stack = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.success = false;
        this.errors = errors;
        this.data = data;
        this.name = this.constructor.name;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default ApiError;
