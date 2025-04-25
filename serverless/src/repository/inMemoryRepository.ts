import { IPaymentRepository } from "./IRepository";

export class InMemoryRepository implements IPaymentRepository {
    private payments: any[] = [];

    async savePayment(data: any): Promise<any> {
        this.payments.push(data);
        return data;
    }

    async getPayments(): Promise<any[]> {
        return this.payments;
    }
}