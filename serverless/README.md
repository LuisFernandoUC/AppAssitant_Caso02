# EchoPay Backend

This code consists of an API developed and deployed on AWS Lambda using the Serverless Framework. The platform manages recurring payments.

---

## Architecture

- **Handlers**: Responsible for receiving HTTP requests (`createPaymentHandler`, `getPaymentHandler`).
- **Middleware**: Implements `AuthMiddleware` using a chainable `MiddlewareChain` (Chain of Responsibility Pattern).
- **Logger**: Decoupled design with `ConsoleLogger` (based on the Strategy Pattern).
- **Service Layer**: `PaymentService` handles business logic and input validation.
- **Repository Layer**: `PaymentRepository` communicates with the MSSQL database.
- **Utils**: Connects to MSSQL through `mssqlConnector.ts` using secure environment variables.

---

## Deployment

The application is deployed on AWS Lambda using the Serverless Framework.

### Prerequisites

- Node.js 18+
- AWS CLI (`aws configure`)
- Serverless Framework (`npm install -g serverless`)
- `.env` configured with database credentials

### Environment Variables (.env)

Create a `.env` file at the project root with the following structure:

```
DB_USER=your_user
DB_PASS=your_password
DB_SERVER=your_server.database.windows.net
DB_NAME=your_db
```

### Deployment Commands

1. **Install project dependencies**

```bash
npm install
```

2. **Login to Serverless Framework (one-time)**

```bash
serverless login
```

3. **Configure AWS credentials**

```bash
aws configure
```

4. **Deploy to AWS Lambda**

```bash
serverless deploy
```

5. **View execution logs (optional)**

```bash
serverless logs -f createPayment
serverless logs -f getPayments
```

6. **Remove the service (optional)**

```bash
serverless remove
```

---

## Endpoints

```
POST https://<your-api-id>.execute-api.us-east-1.amazonaws.com/dev/payments
GET  https://<your-api-id>.execute-api.us-east-1.amazonaws.com/dev/payments
```

---

### POST /payments

Creates a new payment.

```json
{
  "userId": "userId",
  "amount": 100,
  "date": "2025-04-20",
  "servicio": "service"
}
```

### GET /payments

Retrieves all registered payments.

---

## Testing

- **Postman** was used to validate the API.
- A collection was created with various test cases (valid and invalid).
- Authentication middleware was verified to reject requests without a token.

---

## Design and Applied Patterns

- **Chain of Responsibility**: `MiddlewareChain`
- **Strategy Pattern**: Agnostic Logger (`ConsoleLogger`, `Logger` interface)
- **Service Layer Pattern**: Business logic separated into `PaymentService`
- **Repository Pattern**: Abstracted database access
- **Middleware Optionality**: Middleware can be chained or omitted easily

---

## Project Structure

```
├── handlers/
│   ├── createPaymentHandler.ts
│   └── getPaymentHandler.ts
├── middleware/
│   └── authMiddleware.ts
├── repository/
│   └── paymentRepository.ts
├── services/
│   └── paymentService.ts
├── utils/
│   ├── mssqlConnector.ts
│   └── logger.ts
├── serverless.yml
├── .env
└── README.md
```

---

## Problems Encountered and Solutions Applied (based on the Serverless template)

### 1. Middleware logic embedded within handlers
**Problem:** Middleware logic was written directly inside each handler, mixing responsibilities and making reuse difficult.  
**Solution:** An `AbstractHandler` class was created to centralize middleware execution and error handling. Each handler now only implements its specific business logic.  
**Benefit:** Improved code reuse, clarity, and modularity.

### 2. Usage of `console.log` instead of a logging strategy
**Problem:** Event logging was done with `console.log`, which is not scalable or production-grade.  
**Solution:** A `CloudLogger` class based on the `ILogger` interface was implemented, writing directly to `stdout` (captured by AWS CloudWatch).  
**Benefit:** Logs are now structured, persistent, and can easily change the destination (CloudWatch, file, etc.) thanks to the Strategy Pattern.

### 3. Lack of separation between business logic and data access
**Problem:** Handlers accessed the repository or database directly, causing strong coupling.  
**Solution:** A `PaymentService` class was introduced to encapsulate business rules and delegate storage to an injected repository via the `IPaymentRepository` interface.  
**Benefit:** Enables easier unit testing, allows switching data sources without affecting business logic, and improves architectural clarity.

### 4. Non-configurable middleware chain
**Problem:** All middlewares were static and could not be enabled/disabled per environment.  
**Solution:** The middleware chain is now dynamically constructed for each handler, including mandatory middlewares (like `AuthMiddleware`) and optional ones (like `LoggerMiddleware`, activated via `USE_LOGGER`).  
**Benefit:** Allows environment-specific configurations and avoids unnecessary processing during development.

### 5. Lack of input validation and error handling
**Problem:** The API did not validate input data, risking errors or invalid database records.  
**Solution:** Validations were added inside `PaymentService`, rejecting incomplete or incorrectly formatted requests.  
**Benefit:** Prevents insertion of corrupt data and enhances overall backend robustness.
