export interface Middleware {
    execute(ctx: any, next: () => Promise<void>): Promise<void>;
}
