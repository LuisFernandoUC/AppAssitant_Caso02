import { ILogger } from "./ILogger";

export class ConsoleLogger implements ILogger {
    log(message: string): void {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] LOG: ${message}`);
    }

    info(message: string): void {
        const timestamp = new Date().toISOString();
        console.info(`[${timestamp}] INFO: ${message}`);
    }

    error(message: string): void {
        const timestamp = new Date().toISOString();
        console.error(`[${timestamp}] ERROR: ${message}`);
    }
}