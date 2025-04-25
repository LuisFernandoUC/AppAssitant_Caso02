import { getConnection } from '../utils/mssqlConnector';
import { IPaymentRepository } from './IRepository';
import { ILogger } from '../logger/ILogger';

export class PaymentMSSQLRepository implements IPaymentRepository {
    constructor(private logger: ILogger) {
    }

    async savePayment(data: any): Promise<any> {
        try {
            const pool = await getConnection();

            this.logger.info("Ejecutando SP: sp_CreatePayment");

            const result = await pool.request()
                .input("userId", data.userId)
                .input("amount", data.amount)
                .input("date", data.date)
                .input("servicio", data.servicio)
                .execute("sp_CreatePayment");

            return {
                id: result.recordset[0].id,
                ...data
            };
        } catch (err: any) {
            this.logger.error("Error en PaymentMSSQLRepository.savePayment: " + err.message);
            throw err;
        }
    }

    async getPayments(): Promise<any[]> {
        this.logger.info("Ejecutando SP: sp_GetPayments");
        const pool = await getConnection();
        const result = await pool.request()
            .execute('sp_GetPayments');

        return result.recordset;
    }
}

