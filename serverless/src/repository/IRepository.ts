export interface IPaymentRepository {
    savePayment(data: any): Promise<any>;
    getPayments(): Promise<any[]>;
}
