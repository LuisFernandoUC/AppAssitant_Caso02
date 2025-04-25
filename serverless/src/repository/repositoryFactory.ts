// src/repository/repositoryFactory.ts
import { IPaymentRepository } from "./IRepository";
import { PaymentMSSQLRepository } from "./paymentMSSQLRepository";
import { InMemoryRepository } from "./inMemoryRepository";
import { ConsoleLogger } from "../logger/consoleLogger";

export const getPaymentRepository = (): IPaymentRepository => {
    switch (process.env.REPO_SOURCE) {
        case "memory":
            return new InMemoryRepository();
        default:
            return new PaymentMSSQLRepository(new ConsoleLogger());
    }
};
