# EchoPay - Serverless Backend con TypeScript

Este proyecto implementa un backend para la plataforma de pagos **EchoPay** utilizando AWS Lambda, Serverless Framework y TypeScript. El sistema está organizado en capas, permite una arquitectura limpia, escalable y lista para microservicios. Incluye middlewares encadenables, repositorios desacoplados con MSSQL, y logger agnóstico.

---

## 📁 Estructura del Proyecto

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

## ✅ Requisitos

- Node.js 18 o superior
- AWS CLI configurado
- Serverless Framework (`npm install -g serverless`)

---

## 🚀 Instrucciones para configurar

1. **Clonar el repositorio**:

```bash
git clone https://github.com/LuisFernandoUC/AppAssitant_Caso02.git
cd AppAssitant_Caso02/serverless
```

2. **Instalar dependencias**:

```bash
npm install
```

3. **Crear archivo `.env`**:

```dotenv
DB_USER=usuario
DB_PASS=contraseña
DB_SERVER=servidor
DB_NAME=nombre_base
```

4. **Compilar el proyecto**:

```bash
npm run build
```

---

## 🧪 Ejecutar localmente

Instalar plugin offline:

```bash
npm install serverless-offline --save-dev
```

Editar `serverless.yml`:

```yaml
plugins:
  - serverless-dotenv-plugin
  - serverless-offline
```

Iniciar localmente:

```bash
serverless offline
```

---

## ☁️ Despliegue en AWS

```bash
serverless deploy
```

---
