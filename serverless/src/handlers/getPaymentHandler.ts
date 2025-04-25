// src/handlers/getPaymentHandler.ts

import { AbstractHandler } from "./abstractHandler";
import { AuthMiddleware } from "../middleware/AuthMiddleware";
import { LoggerMiddleware } from "../middleware/LoggerMiddleware";
import { PaymentService } from "../services/paymentService";
import { PaymentMSSQLRepository } from "../repository/paymentMSSQLRepository";

// Lista de middlewares a usar
const middleware = [
    new AuthMiddleware(), // Middleware para autenticación
    new LoggerMiddleware() // Middleware para registro de logs
];

class GetPaymentHandler extends AbstractHandler {
    constructor() {
        super(middleware); // Se pasa la lista de middlewares al constructor de la clase base
    }

    protected async execute(ctx: any): Promise<any> {
        // Se inicializa el repositorio y el servicio de pagos
        const repository = new PaymentMSSQLRepository(ctx.logger);
        const service = new PaymentService(repository, ctx.logger);

        // Se registra un mensaje en los logs
        ctx.logger?.info("Handler: obteniendo pagos...");
        // Se obtienen los pagos a través del servicio
        const result = await service.listPayments();
        return {
            statusCode: 200, // Respuesta exitosa
            body: JSON.stringify(result) // Se devuelve el resultado en formato JSON
        };
    }
}

// Instancia única del handler
const handlerInstance = new GetPaymentHandler();

// Exportación final que AWS Lambda espera
export const handler = async (event: any) => {
    try {
        // Se ejecuta el handler con el evento recibido
        return await handlerInstance.run(event); // run ahora debe ser `public` en AbstractHandler
    } catch (err: any) {
        // Manejo de errores en caso de fallo
        return {
            statusCode: 500, // Respuesta de error interno
            body: JSON.stringify({
                message: "Error interno en el servidor", // Mensaje de error
                error: err.message // Detalle del error
            })
        };
    }
};
