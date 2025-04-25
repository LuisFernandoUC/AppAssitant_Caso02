import { ILogger } from "./ILogger";
import { CloudWatchLogsClient, PutLogEventsCommand } from "@aws-sdk/client-cloudwatch-logs";

export class CloudLogger implements ILogger {
    private groupName = "/aws/lambda/echopay";
    private streamName = "general";
    private client = new CloudWatchLogsClient({ region: "us-east-1" });

    log(message: string): void {
        this.send(message, "LOG");
    }

    info(message: string): void {
        this.send(message, "INFO");
    }

    error(message: string): void {
        this.send(message, "ERROR");
    }

    private async send(message: string, level: string) {
        const timestamp = new Date().toISOString();
        const fullMessage = `[${timestamp}] ${level}: ${message}`;

        console.log(fullMessage);

    }
}
    