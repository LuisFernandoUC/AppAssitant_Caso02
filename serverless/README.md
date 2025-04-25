# EchoPay - Serverless Backend with TypeScript

This project implements a backend for the **EchoPay** payment platform using AWS Lambda, the Serverless Framework, and TypeScript. The system is layered and follows a clean, scalable architecture ready for microservices. It includes chainable middleware, decoupled repositories with MSSQL, and an agnostic logger.

---

## Project Structure

```
serverless/
├── handlers/             # Handlers para Lambda (getPayments, createPayment)
├── middleware/           # Middlewares (auth, logger)
├── repository/           # Repositorios con lógica de base de datos (MSSQL)
├── services/             # Lógica de negocio (PaymentService)
├── logger/               # Implementación de ILogger
├── utils/                # Conexiones y utilidades generales
├── .env                  # Variables de entorno (no versionado)
├── serverless.yml        # Configuración del framework
├── package.json
├── tsconfig.json
└── README.md
```

---

## Requirements

- Node.js 18 or higher
- AWS CLI configured
- Serverless Framework (`npm install -g serverless`)

---

## Setup Instructions

1. **Clone the repository**:

```bash
git clone https://github.com/LuisFernandoUC/AppAssitant_Caso02.git
cd AppAssitant_Caso02/serverless
```

2. **Install dependencies**:

```bash
npm install
```

3. **Create the `env` file**:

```dotenv
DB_USER=username
DB_PASS=password
DB_SERVER=server
DB_NAME=database_name
```

4. **Compile the project**:

```bash
npm run build
```

---

## Run Locally

Install the offline plugin:

```bash
npm install serverless-offline --save-dev
```

Edit the `serverless.yml` file and add the following plugins:

```yaml
plugins:
  - serverless-dotenv-plugin
  - serverless-offline
```

Start locally:

```bash
serverless offline
```

---

## Deploy to AWS

```bash
serverless deploy
```

---
