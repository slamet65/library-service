export class Response {
    success(code: number, message: string, payload: any) {
        return {
            statusCode: code ||200,
            message,
            data: payload
        }
    }
    
    error(code: number, message: string) {
        return {
            statusCode: code ||400,
            message,
        }
    }
}