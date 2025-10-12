class ApiResponse<T = unknown> {
    public readonly statusCode: number;
    public readonly success: boolean;
    public readonly data: T | null;
    public readonly message: string;

    constructor(
        statusCode: number,
        data: T | null = null,
        message = "success"
    ) {
        this.statusCode = statusCode;
        this.success = statusCode < 400;
        this.data = data;
        this.message = message;
    }
}

export default ApiResponse;
