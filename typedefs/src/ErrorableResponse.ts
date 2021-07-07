export type ErrorableResponse<T> = [
    T | null,
    Error | null
]