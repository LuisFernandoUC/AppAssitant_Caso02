// src/middleware/LoggerMiddleware.ts
import { Middleware } from "../middleware/abstractMiddleware";
import { ConsoleLogger } from "../logger/consoleLogger";

export class LoggerMiddleware implements Middleware {
    private logger = new ConsoleLogger(); // Aquí se crea una instancia de ConsoleLogger para manejar los logs.

    async execute(ctx: any, next: () => Promise<void>): Promise<void> {
        const method = ctx.event.httpMethod; // Obtiene el método HTTP (GET, POST, etc.) de la solicitud.
        const path = ctx.event.path; // Obtiene la ruta del endpoint que se está llamando.
        const user = ctx.user?.id || "Anonymous"; // Si hay un usuario autenticado, toma su ID; si no, usa "Anonymous".

        ctx.logger = this.logger; // Agrega el logger al contexto para que esté disponible en otras partes.

        this.logger.info(`[${method}] ${path} | Usuario: ${user} | Inicio`); // Log inicial indicando que la ejecución comienza.

        await next(); // Llama al siguiente middleware o función en la cadena.

        this.logger.info(`[${method}] ${path} | Usuario: ${user} | Fin`); // Log final indicando que la ejecución terminó.
    }
}