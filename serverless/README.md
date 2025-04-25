# EchoPay Backend

Este codigo y consiste en una API desarrollada, desplegada en AWS Lambda utilizando el Serverless Framework. La plataforma gestiona pagos recurrentes.

---

## Arquitectura

- **Handlers**: Se encargan de recibir las solicitudes HTTP (`createPaymentHandler`, `getPaymentHandler`).
- **Middleware**: Se implementa `AuthMiddleware` con un `MiddlewareChain` encadenable (Chain of Responsibility Pattern).
- **Logger**: Diseño desacoplado con `ConsoleLogger` (basado en Strategy Pattern).
- **Service Layer**: `PaymentService` maneja la lógica de negocio y valida entradas.
- **Repository Layer**: `PaymentRepository` se comunica con la base de datos MSSQL.
- **Utils**: Conexión a MSSQL a través de `mssqlConnector.ts` usando variables de entorno seguras.

---

## Despliegue

La aplicación está desplegada en AWS Lambda utilizando Serverless Framework.

### Requisitos Previos

- Node.js 18+
- AWS CLI (`aws configure`)
- Serverless Framework (`npm install -g serverless`)
- `.env` configurado con las credenciales de la base de datos

### Variables de entorno (.env)

Este proyecto usa un archivo `.env` para cargar las credenciales de base de datos desde `serverless.yml`.

Crea un archivo `.env` en la raíz del proyecto siguiendo este ejemplo:

```
DB_USER=your_user
DB_PASS=your_password
DB_SERVER=your_server.database.windows.net
DB_NAME=your_db
```

### Comandos de despliegue

1. **Instalar dependencias del proyecto**

```bash
npm install
```

2. **Iniciar sesión en Serverless Framework (una sola vez)**

```bash
serverless login
```

3. **Configurar credenciales de AWS**

```bash
aws configure
```

4. **Desplegar a AWS Lambda**

```bash
serverless deploy
```

5. **Ver logs de ejecución (opcional)**

```bash
serverless logs -f createPayment
serverless logs -f getPayments
```

6. **Remover el servicio (opcional)**

```bash
serverless remove
```

## Endpoints

Una vez desplegado, Serverless mostrará los endpoints públicos de la API:

```
POST https://<your-api-id>.execute-api.us-east-1.amazonaws.com/dev/payments
GET  https://<your-api-id>.execute-api.us-east-1.amazonaws.com/dev/payments
```

---

### POST /payments

Crea un nuevo pago.

```json
{
  "userId": "idUsuario",
  "amount": 100,
  "date": "2025-04-20",
  "servicio": "servicio"
}
```

### GET /payments

Obtiene todos los pagos registrados.

---

## Pruebas

- Se utilizó **Postman** para validar la API.
- Se creó una colección con diferentes casos de prueba (válidos e inválidos).
- Se verificó que el middleware de autenticación rechaza solicitudes sin token.

---

## Problemas Encontrados y Soluciones

### 1. `next() called multiple times`

**Solución:** Validación de índice en `MiddlewareChain` para evitar doble llamada a `next()`.

### 2. Errores de conexión con MSSQL

**Solución:** Asegurar cifrado TLS (`encrypt: true`) y configurar `trustServerCertificate` como `false`.

### 3. JSON malformado

**Solución:** Validación y parseo dentro del servicio con mensajes de error personalizados.

---

## Diseño y Patrones Aplicados

- **Chain of Responsibility**: MiddlewareChain
- **Strategy Pattern**: Logger agnóstico (`ConsoleLogger`, `Logger` interface)
- **Service Layer Pattern**: Separación de lógica de negocio en `PaymentService`
- **Repository Pattern**: Abstracción de acceso a base de datos
- **Middleware Optionality**: Middleware puede ser encadenado o omitido fácilmente

---

## Estructura del codigo

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
