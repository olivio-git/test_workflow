export interface ValidationError {
    field: string;
    message: string;
}

export interface ApiError {
    message: string;
    status: number;
    timestamp: string;
    type: string;
    validation_errors?: ValidationError[];
}
