import { Middleware } from "./abstractMiddleware";

export class AuthMiddleware implements Middleware {
    async execute(ctx: any, next: () => Promise<void>): Promise<void> {
        const token = ctx.event.headers?.authorization || ctx.event.headers?.Authorization;

        // Verifica si hay un token de autorización en los encabezados de la solicitud.
        // Si no hay token, lanza un error de "No autorizado".
        if (!token) {
            throw new Error("No autorizado: Token no proporcionado");
        }

        // Si el token existe, simula la asignación de un usuario al contexto (ctx).
        ctx.user = {
            id: "simulated-user-id",
            role: "admin"
        };

        // Luego, permite que la ejecución continúe con el siguiente middleware o función.
        await next();
    }
}
