import { PaymentService } from "../services/paymentService";
import { InMemoryRepository } from "../repository/inMemoryRepository";

const service = new PaymentService(new InMemoryRepository(), console);

await service.createPayment({
    userId: "123",
    amount: "100.50",
    service: "Luz",
    scheduledDate: "2025-05-01"
});

