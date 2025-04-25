import { IPaymentRepository } from "../repository/IRepository";
import { ILogger } from "../logger/ILogger";

export class PaymentService {
    constructor(
        private repo: IPaymentRepository,
        private logger: ILogger
    ) { }

    async createPayment(data: any) {
        this.logger.info("Servicio: intentando crear un nuevo pago...");

        // Validaciones básicas
        if (!data.userId || !data.amount || !data.servicio || !data.date) {
            this.logger.error("Servicio: datos incompletos para crear pago");
            throw new Error("Datos de pago incompletos");
        }

        // Normalización (esto se puede extender o mover a un helper)
        const paymentData = {
            userId: data.userId,
            amount: parseFloat(data.amount),
            service: data.servicio.toLowerCase().trim(),
            scheduledDate: new Date(data.date)
        };

        try {
            const result = await this.repo.savePayment(paymentData);
            this.logger.info("Servicio: pago guardado exitosamente.");
            return result;
        } catch (error: any) {
            this.logger.error("Servicio: error al guardar el pago.");
            throw new Error("No se pudo guardar el pago.");
        }
    }

    async listPayments() {
        this.logger.info("Servicio: listando pagos...");
        try {
            const result = await this.repo.getPayments();
            this.logger.info(`Servicio: se encontraron ${result.length} pagos.`);
            return result;
        } catch (error: any) {
            this.logger.error("Servicio: error al obtener pagos.");
            throw new Error("No se pudieron obtener los pagos.");
        }
    }
}
