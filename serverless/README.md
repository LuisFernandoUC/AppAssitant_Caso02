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

## Problemas encontrados y soluciones aplicadas (desde la plantilla Serverless)

### 1. Lógica de middleware incrustada en los handlers
**Problema:** La lógica de los middlewares estaba escrita directamente dentro de cada handler, mezclando responsabilidades y dificultando su reutilización.  
**Solución:** Se creó una clase `AbstractHandler` que centraliza la ejecución de middlewares y el manejo de errores. Ahora, cada handler solo implementa su lógica de negocio específica.  
**Beneficio:** Se mejora la reutilización de código, la claridad y la modularidad del sistema.

### 2. Uso de `console.log` en lugar de una estrategia de logging
**Problema:** El registro de eventos se realizaba con `console.log`, lo cual no es escalable ni adecuado para entornos de producción.  
**Solución:** Se implementó una clase `CloudLogger` basada en la interfaz `ILogger`, que escribe directamente en `stdout` (capturado por AWS CloudWatch).  
**Beneficio:** Los logs ahora son estructurados, persistentes y permiten cambiar fácilmente el destino (CloudWatch, archivo, etc.) gracias al patrón Strategy.

### 3. Falta de separación entre lógica de negocio y acceso a datos
**Problema:** Los handlers accedían directamente al repositorio o base de datos, generando acoplamiento fuerte.  
**Solución:** Se introdujo una clase `PaymentService` que encapsula las reglas de negocio y delega el almacenamiento en un repositorio inyectado mediante la interfaz `IPaymentRepository`.  
**Beneficio:** Permite realizar pruebas unitarias más fácilmente, cambiar la fuente de datos sin afectar la lógica y mejora la claridad arquitectónica.

### 4. Cadena de middlewares no configurable
**Problema:** Todos los middlewares eran estáticos y no se podían activar/desactivar según el entorno.  
**Solución:** La cadena de middlewares ahora se construye dinámicamente por cada handler, incluyendo middlewares obligatorios (como `AuthMiddleware`) y opcionales (como `LoggerMiddleware`, activado por la variable `USE_LOGGER`).  
**Beneficio:** Permite configuraciones específicas por entorno y evita procesamiento innecesario en desarrollo.

### 5. Falta de validación o control de errores en las solicitudes
**Problema:** La API no validaba los datos de entrada, lo que podía generar errores o registros inválidos en la base de datos.  
**Solución:** Se agregaron validaciones en `PaymentService`, rechazando peticiones incompletas o mal formateadas.  
**Beneficio:** Se evita la inserción de datos corruptos y se mejora la solidez general del backend.
