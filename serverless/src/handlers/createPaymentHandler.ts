// Importamos los middlewares y clases necesarias para manejar la lógica del handler
import { AuthMiddleware } from "../middleware/AuthMiddleware";
import { LoggerMiddleware } from "../middleware/LoggerMiddleware";
import { AbstractHandler } from "./abstractHandler";
import { PaymentMSSQLRepository } from "../repository/paymentMSSQLRepository";
import { PaymentService } from "../services/paymentService";
import { CloudLogger } from "../logger/cloudLogger";

const middleware = [
    new AuthMiddleware(), // obligatorio
    ...(process.env.USE_LOGGER === "true" ? [new LoggerMiddleware()] : []) // opcional
];

// Definimos la clase del handler para crear pagos
export class createPaymentHandler extends AbstractHandler {
    private logger: CloudLogger;

    constructor() {
        super(middleware); // Pasamos los middlewares al constructor de la clase base
        this.logger = new CloudLogger();
    }

    // Método principal que ejecuta la lógica de creación de pagos
    protected async execute(ctx: any): Promise<any> {
        // Creamos una instancia del repositorio para manejar la base de datos
        const repository = new PaymentMSSQLRepository(this.logger);
        // Creamos una instancia del servicio que contiene la lógica de negocio
        const service = new PaymentService(repository, this.logger);

        // Obtenemos el cuerpo de la solicitud y lo convertimos a un objeto
        const body = JSON.parse(ctx.event.body);

        // Registramos un mensaje en los logs
        this.logger.info("Handler: creando pago...");
        // Llamamos al servicio para crear el pago y obtenemos el resultado
        const result = await service.createPayment(body);

        // Devolvemos una respuesta exitosa con el resultado
        return {
            statusCode: 201,
            body: JSON.stringify({
                message: "Pago guardado exitosamente",
                data: result
            })
        };
    }
}

// Creamos una instancia del handler
const handlerInstance = new createPaymentHandler();

// Exportamos la función que será llamada como punto de entrada
export const handler = async (event: any) => {
    try {
        // Ejecutamos el handler y devolvemos la respuesta
        return await handlerInstance.run(event);
    } catch (err: any) {
        // Si ocurre un error, devolvemos una respuesta con el mensaje de error
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Error interno en el servidor",
                error: err.message
            })
        };
    }
};