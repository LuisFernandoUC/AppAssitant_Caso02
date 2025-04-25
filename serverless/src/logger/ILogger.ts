export interface ILogger {
    log(message: string): void;
    error(message: string): void;
    info(message: string): void;
}