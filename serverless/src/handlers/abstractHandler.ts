import { APIGatewayEvent } from "aws-lambda";
import { Middleware } from "../middleware/abstractMiddleware";

// Esta clase abstracta define un manejador base para procesar eventos de API Gateway.
// Permite ejecutar una cadena de middleware antes de ejecutar la lógica principal.
export abstract class AbstractHandler {
    private middlewareChain: Middleware[];

    // El constructor recibe una lista de middleware que se ejecutarán en orden.
    constructor(middlewareChain: Middleware[]) {
        this.middlewareChain = middlewareChain;
    }

    // Este método principal se encarga de procesar el evento recibido.
    public async run(event: APIGatewayEvent): Promise<any> {
        const ctx: any = { event }; // Se crea un contexto que contiene el evento.
        let index = -1;

        // Función que avanza al siguiente middleware en la cadena.
        const next = async () => {
            index++;
            if (index < this.middlewareChain.length) {
                let called = false;
                // Ejecuta el middleware actual y asegura que "next" no se llame más de una vez.
                await this.middlewareChain[index].execute(ctx, async () => {
                    if (called) throw new Error("next() called multiple times");
                    called = true;
                    return next();
                });
            }
        };

        try {
            await next(); // Ejecuta todos los middleware en orden.
            return await this.execute(ctx); // Llama a la lógica principal definida en clases hijas.
        } catch (err: any) {
            // Maneja errores que ocurran en los middleware o en la lógica principal.
            console.error("Middleware/Handler error:", err);
            return {
                statusCode: 500, // Responde con un error interno del servidor.
                body: JSON.stringify({
                    message: "Internal Server Error",
                    ...(process.env.NODE_ENV !== "production" && { error: err.message }) // Incluye detalles del error si no está en producción.
                })
            };
        }
    }

    // Método abstracto que debe ser implementado por las clases hijas para definir la lógica principal.
    protected abstract execute(ctx: any): Promise<any>;
}
