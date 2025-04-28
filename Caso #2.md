# EchoPay App

Members

- Luis Fernando Ureña Corrales - 2023064329
- Luis Alejandro Masís Pérez - 2017239616
- Nicole Tatiana Parra Valverde - 2023223291
- Danielo Wu Zhong - 2023150448

## Description:

EchoPay is a web-based and voice-based personal payment assistant that helps users manage, schedule, and execute recurring utility payments. It uses artificial intelligence to process natural language commands and integrates with banking APIs to ensure transaction security. The platform is designed for ease of use, security, and scalability.

## Stack:

**Frontend**:
-React
-Tailwind CSS
-TypeScript
**Backend**:
-Next.js  
**Database**:
-MSSQL Azure

## Frontend design specifications

### Authentication platform: Auth0

For the authentication platform, we have chosen Auth0 due to its robust features and ease of integration with web applications. Auth0 meets all the required criteria being:

- It supports login and password authentication, ensuring secure access to user accounts via JWTs.
- Auth0 provides automatic screen generation or an SDK for building custom login interfaces, making it easier to implement user authentication without building the system from scratch.
- Fully compatible with React and Next.js, enabling seamless integration into the frontend of the system.
- Auth0 offers API access to authenticate users programmatically, allowing us to validate and manage users without relying on the server-side session management.
- It supports Multi-Factor Authentication (MFA), ensuring a higher level of security. Additionally, Auth0 provides a sandbox environment that allows testing authentication flows, facilitating the development process.

---

### Demo Code:

To test how Auth0 works and how the login screen can be customized, a demo code was used based on the selected frontend technology: **Next.js with TypeScript**.

#### 1. Creating the Auth0 Application

An application was created in the [Auth0 Dashboard](https://manage.auth0.com/) with the following configuration:

- **Application Type:** Regular Web Application
- **Name:** DemoCode
- **Technology Stack:** Next.js

#### 2. Configuring Callback and Logout URLs

In the application settings, the following URLs were added:

- **Allowed Callback URLs:**  
  `http://localhost:3000/api/auth/callback`

- **Allowed Logout URLs:**  
  `http://localhost:3000`

- **Allowed Web Origins:**  
  `http://localhost:3000`

These settings allow proper redirection during the login and logout flows in development.

#### 3. Setting Up Environment Variables

The `.env.local` file was created in the root of the project with the necessary variables from Auth0:

- AUTH0_SECRET= secret-generated-with-openssl (or a random chain of characters)
- AUTH0_BASE_URL= http://localhost:3000
- AUTH0_ISSUER_BASE_URL= https://auth0-domain.auth0.com
- AUTH0_CLIENT_ID= client-id
- AUTH0_CLIENT_SECRET= client-secret

#### 4. Installing the Demo Code and Dependencies

The official Next.js demo code provided by Auth0 was used. After placing the code in the project folder, the following command was executed to install the dependencies:

- npm install

#### 5. Running the Application

To launch the app in development mode, the following command was executed:

- npm run dev

This started the development server on http://localhost:3000.

#### 6. Testing the Authentication Flow

The demo application includes login and logout buttons. When clicking the Login button, the app redirects the user to the Auth0-hosted login screen. Upon successful authentication (by introducing the correct email and password or using a google account), the sistem asks the user for it's OTP(as a MFA authentication), then the user is redirected back to the application.

After logging in, user profile information is displayed, demonstrating that authentication was successful and session management is working correctly.

#### 7. Customizing the Auth0 Login Interface

Auth0 provides a hosted login page that can be customized directly from the Auth0 Dashboard. Here's how the customization process was carried out:

1. **Accessing the Universal Login Settings**

   From the Auth0 Dashboard:

   - Navigate to **Branding** > **Universal Login**.
   - Select the **Login** tab.

2. **Selecting the Customization Mode**  
   Auth0 offers two modes:

   - **Classic**: Allows full customization using custom HTML, CSS, and JavaScript.
   - **New Universal Login Experience**: A modern, streamlined experience with limited visual customization but easier to configure.

   For this demo, the **New Universal Login Experience** was used to keep the configuration simple and consistent with current best practices.

3. **Customizing the Login Page**

   - The logo and primary color were changed under **Branding > Universal Login > Advanced Options > Customize**.
   - Additional UI elements like the title, background color, and button style can be adjusted using the branding options.
   - If using **Classic**, a custom HTML template can be provided to fully style the login experience.

4. **Saving and Previewing**  
   After making the desired changes, the updated login screen was previewed and saved. When logging in from the local app, the changes were reflected immediately in the hosted login page.

---

### Postman Requests

You can view or import the full Postman collection for this flow here:  
[Postman Collection - Login Flow](https://www.postman.com/maintenance-cosmonaut-70125097/workspace/auth0-mfa-demonstation/collection/44091561-a8ed4c1a-0747-4ae7-92ac-774f1fe6ea03?action=share&creator=44091561)

#### Request 1

The first request initiates a login attempt by providing only the username and password in the request body. This is a standard initial step in many authentication flows. However, in this case, the response does not return an access token immediately. Instead, the response includes an error message indicating that multifactor authentication (MFA) is required.

The error field in the response contains the value mfa_required, and the description clearly states that "Multifactor authentication is required." This is a clear indicator that the Auth0 tenant has MFA enforcement enabled and correctly blocks access until the second authentication factor is verified.

In addition to the error, the response includes an MFA token. This token is not an access token and does not grant access to protected resources. Instead, it is a short-lived token that represents a pending MFA challenge. It must be included in a subsequent request, where the user will provide the second authentication factor (such as a one-time password from an authenticator app or another supported method).

Here's a breakdown of the query parameters:

- **`response_type=code`**: This specifies that the client expects an authorization code in response.
- **`client_id`**: The unique identifier for the application in Auth0.
- **`redirect_uri`**: The URI where the user will be redirected after completing the login. This URI should match the one set up in the Auth0 application configuration.
- **`scope`**: Defines the permissions the application is requesting. In this case, the `openid`, `profile`, and `email` scopes are requested.
- **`audience`**: This refers to the API that the tokens will grant access to. In this case, it is the Payment Assistant API.

This request serves to confirm several things:

- That the system is enforcing MFA correctly.

- That users cannot authenticate using only a username and password.

- That the correct error and challenge flow is initiated by returning an mfa_token.

#### Request 2

The second request continues the MFA-enforced login flow by completing the MFA challenge. After the first request returns an `mfa_token`, this request submits that token along with a valid one-time password (OTP) generated by the user’s authenticator app or other configured MFA method.

This request uses the custom grant type `http://auth0.com/oauth/grant-type/mfa-otp`, which is specific to Auth0's MFA flow. It verifies that the user has successfully passed the second authentication factor and, if successful, returns an `access_token` and `id_token`.

This is a critical step in the flow because it transitions the user from _pending MFA_ to _fully authenticated_, granting them access to the application or API.

**Request Body Parameters:**

- `grant_type`: Custom grant type for MFA OTP. Value: `http://auth0.com/oauth/grant-type/mfa-otp`
- `client_id`: The Client ID of the application registered in Auth0.
- `client_secret`: The application's client secret (only for confidential applications).
- `mfa_token`: The temporary token received in the previous step that represents a pending MFA challenge.
- `otp`: The one-time password generated by the user’s MFA device (e.g., Google Authenticator).

**Expected Successful Response:**

json:
{
"access_token": "eyJz93a...k4laUWw",
"id_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
"expires_in": 86400,
"token_type": "Bearer"
}

**Key Points:**

- This request completes the MFA challenge successfully.
- It issues a valid access_token and id_token.
- The user is now fully authenticated and can access protected resources.
- This confirms the MFA flow is working as expected with OTP-based authentication.

#### Request 3

The third request is for a complete the authentication flow by exchanging a **verification code** for tokens. This is a crucial step in the **Authorization Code Flow** with Auth0, a commonly used method for secure user authentication in production environments. The purpose of this request is to exchange the authorization code obtained from the user’s successful login and Multi-Factor Authentication (MFA) for the necessary tokens that will be used to authorize subsequent API requests and provide user-related information.

The request is made to Auth0's `/oauth/token` endpoint with the following fields in the body:

- **`grant_type`**: Set to `authorization_code`. This indicates that the client is attempting to exchange an authorization code for an access token. This step is part of the **Authorization Code Flow**, which is one of the most secure OAuth 2.0 flows.
- **`code`**: This is the verification code received after the user successfully completes the MFA challenge. It is a one-time use code that was generated by Auth0 during the authorization phase.
- **`redirect_uri`**: This must be the same as the redirect URI used during the authorization request, and it must match what has been configured in the Auth0 dashboard. This ensures that the request is legitimate and not being tampered with.
- **`client_id`** and **`client_secret`**: These are the credentials of the application. They are used to identify and authenticate the app to Auth0. The `client_id` uniquely identifies the app, while the `client_secret` is used to prove that the request is coming from the actual app and not from an attacker.

This verification code (`code`) is obtained through the following process:

1. **Start the development server**:

   - You need to start the server with the command `npm run dev`. This will run the application locally and allow you to proceed with the authentication flow.

2. **Open the Auth0 authorization URL**:
   - In the browser, open the following URL, which is Auth0’s authorization endpoint. This URL includes all the necessary parameters for the initial authentication request:

<https://dev-5dp1b6y0xuwqglt1.us.auth0.com/authorize?response_type=code&client_id=vC5teCwmKnpZA7cnybb87RXCaRwCoLPL&redirect_uri=http://localhost:3000/auth/callback&scope=openid%20profile%20email&audience=https://payment-assistant-api.com>

3. **Login using the test user**:

- Once the page loads, log in using the **test credentials** provided for this example:
  - **Email**: `danielowu1012@gmail.com`
  - **Password**: `b-uvWDqu3XJBuUY`
    But, using the gmail login also works due to the need of the OTP.

The user will be prompted to enter these details. After successful login, MFA will be triggered.

4. **Multi-Factor Authentication (MFA)**:

- After entering the username and password, the user will be prompted for the **One-Time Password (OTP)** as part of the MFA challenge. This is a security measure to verify the identity of the user.
- The OTP is typically sent via an authentication app (like Google Authenticator or Auth0’s Guardian app), or via email/SMS depending on the MFA setup.

5. **Redirection after successful MFA**:

- Once the MFA challenge is completed successfully, Auth0 will redirect the user to the callback URL configured in the initial authorization request.
- The URL will look similar to:

http://localhost:3000/auth/callback?code=9ax_OG55k8he0RWWtbTZ9epTawbkrQXRJULdvBE-lIKsf

- The key part here is the **`code`** parameter, which is the **authorization code** needed to complete the authentication process.

6. **Copy the `code` value**:

- From the URL, copy the value of the `code` parameter and paste it into the body of the token request, replacing `<verification code>`. This code is valid for a short period and is used to request tokens from the `/oauth/token` endpoint.

7. **Making the Token Request**:

- With the authorization code, you can now make the token request to Auth0’s `/oauth/token` endpoint. The request body will contain the following:
  - **`grant_type=authorization_code`**: Indicates this is an Authorization Code flow request.
  - **`code=<verification code>`**: The verification code obtained from the redirection URL.
  - **`redirect_uri=http://localhost:3000/auth/callback`**: Must match the `redirect_uri` used during the initial authorization step.
  - **`client_id` and `client_secret`**: the app’s client credentials.

8. **Successful Authentication Response**:

- If everything is set up correctly and the request is valid, Auth0 will respond with a payload containing several important pieces of information:
  - **`access_token`**: This token is used to authorize API requests. It must be included in the authorization header of subsequent API calls.
  - **`id_token`**: This token contains information about the authenticated user, such as their name, email, and other profile details.
  - **`scope`**: The permissions granted to the application, which are defined during the authorization request. In this case, the scopes are `openid`, `profile`, and `email`.
  - **`expires_in`**: The time in seconds until the access token expires.
  - **`token_type`**: Typically set to `Bearer`, indicating that the token is a bearer token.

9. **Outcome**:

- After receiving the access token and id token, the client application can use them to authenticate API requests and gain access to protected resources. This confirms that the user has been successfully authenticated using the **Authorization Code Flow** with MFA.

This step ensures that the authentication flow, including both password-based login and multi-factor authentication, is working properly. By using the verification code, the client can securely obtain tokens that are required for subsequent interactions with protected resources.

---

## Client Architecture:

EchoPay will follow an N-layer architecture, as it utilizes APIs to separate concerns between the presentation layer (frontend), the business logic (backend), and data access (database).

Technology used to implement this architecture:

- Frontend: React + TypeScript + Tailwind CSS
- Backend: Next.js API Routes
- Database: Azure MSSQL

This architecture allows for better modularity, scalability, and maintainability, and it facilitates future integration with other clients such as mobile applications.

#### Web App Rendering:

EchoPay will primarily use Client-Side Rendering (CSR) to provide a fast and interactive user experience.
However, since the system uses Next.js, Server-Side Rendering (SSR) can also be applied selectively for specific pages where SEO or initial load performance is a concern.

## Visual Components

#### Patterns & Principles

To design and build the visual components of EchoPay, we will follow the following patterns and principles, adapted to our stack (React + Tailwind + TypeScript):

- SOLID (must):
  
  To enforce the Single Responsibility Principle across the entire frontend, we apply a project-wide rule: every file must have a clear, singular purpose, whether it's visual, logical, or structural. We define the following conventions:
  
  1. Atoms should only handle visual rendering (no logic or state)

  2. Hooks like usePaymentHandler.ts must only manage business logic (not UI, not services)

  3. Services like paymentService.ts must only interact with external APIs (no logic, no state, no UI).
   
- DRY (must):

  In addition to creating shared components (InputField.tsx, Button.tsx) and utility hooks (useAuth.ts, useErrorHandler.ts), we define code duplication boundaries:

  1. Any piece of logic repeated more than once must be abstracted (e.g., validation, formatting)

  2. Shared logic lives in hooks/ or utils/

  3. Shared components live in atoms/ or molecules/.
   
- Separation of Concerns (must):

  1. Business logic is handled in hooks such as useAuth.ts and usePaymentHandler.ts.

  2. Presentation logic is handled in clean functional components (e.g., PaymentForm.tsx).

  3. Styling is managed using Tailwind utility classes, fully separated from logic and JSX structure.
   
- Responsive Design (must):

  All components are responsive using Tailwind CSS classes like grid-cols-1 md:grid-cols-2, etc.
For instance, templates/DashboardLayout.tsx defines grid/flex layouts that adapt to screen size.

- Atomic Design (all):

  1. Atoms: smallest elements, like Button.tsx, InputField.tsx, Label.tsx, with no internal layout

  2. Molecules: basic combinations, like TextInputWithLabel.tsx, CheckboxGroup.tsx, composed from atoms

  3. Organisms: sections composed of multiple molecules and atoms, like PaymentSection.tsx, but not entire forms

  4. Templates: layout skeletons (DashboardLayout.tsx)

  5. Pages: route-bound compositions (DashboardPage.tsx, PaymentPage.tsx).
   
- MVVM (React):

  1. View: JSX markup in pages like PaymentPage.tsx

  2. ViewModel: Hook-based logic (usePaymentHandler.ts)

  3. Model: Data types and service calls (types/Payment.ts, services/paymentService.ts)
   
- State Management Pattern (web):

  We will integrate Zustand as a lightweight yet robust state management framework. This allows shared state access across pages and components without prop drilling or context overload. Zustand is now used in:

  1. AuthContext.tsx (refactored)

  2. Navbar.tsx (reads user state)

  3. PaymentPage.tsx (reads state to validate access).

#### Toolkits and Standards

- Tailwind CSS: Tailwind CSS is the sole styling system used in every visual component.
- Storybook: It is configured for isolated development and documentation of atoms and molecules.
- Vercel: It is the deployment platform, taking advantage of Next.js integration.

## Object design patterns

![Texto alternativo](./assets/Object_Design_Patterns.png)

## External Services

The following diagram illustrates how UI components in the EchoPay frontend communicate directly with external services for user experience, automation, and interaction.

![Texto alternativo](./assets/External_Services_EchoPay.png)

**Description of Services:**

- **Auth0**
  Used for user authentication. React components handle login/logout and store tokens.
- **Azure Cognitive Services**
  Allows the user to give payment commands using voice. The voice is transcribed to text in real-time.
- **Azure Text-to-Speech**
  Reads back payment confirmations, enhancing accessibility.
- **Azure Computer Vision**
  Enables users to upload images of receipts or invoices. The system extracts relevant information like amount, date, and service.
- **Payments External APIs**
  Accessed from the frontend to automate service-related operations with external providers (e.g., electricity, water).

These services are invoked through client-side logic and are chosen based on their ability to integrate securely with frontend technologies like React.

## Project Structure

![Texto alternativo](./assets/Project_Structure.png)

## Final FE architecture diagram

![Texto alternativo](./assets/Final_FE_Architecture_Diagram.jpg)

### 1. React Frontend Overview

This project follows a layered architecture to promote maintainability, scalability, and clear separation of concerns.

The structure is organized into:

- **Visual Components Layer (View)**
- **ViewModel Layer**
- **Model Layer**
- **External Services Integration**

Everything is hosted on Vercel for seamless deployment.

### 2. Layer Descriptions

#### Visual Components (View)

- Built with **React + Tailwind CSS** following **Atomic Design** principles.
- Divided into:
  - atoms/
  - molecules/
  - organisms/
  - templates/
  - pages/
- Handles only **UI rendering** and **user interaction**.
- Activated by state changes coming from the ViewModel layer.

#### ViewModel Layer

- Manages **state**, **business logic**, and **application flow**.
- Key classes:
  - **AuthStore (Observable):** Centralized user authentication state.
  - **MiddlewareHandler (Strategy):** Handles middleware executions (Auth, Logging).
  - **UploadManager (Singleton):** Manages file uploads and retries.
  - **ApiHandler (Concrete):** Sends API requests.
  - **EventController (Dispatcher):** Dispatches upload events.
  - **Notification (Abstract):** Defines how notifications are handled.
- Implements **patterns** like **Observer**, **Command**, **Strategy**, and **Singleton**.


#### Model Layer

- Defines **data models** and **API connection logic**.
- Key components:
  - **DTOs:** `Payment.ts`, `User.ts`, `NotificationDTO.ts`
  - **API Connector:** 
    - `ApiConnector.ts` (Axios setup)
    - `endpoints.ts` (Service URLs)
- Optionally supports **adapters** if external data transformations are needed.


#### External Services

- Integrations from the frontend directly to APIs:
  - **Azure Cognitive Services** (Voice recognition)
  - **Azure Text-to-Speech** (Accessibility)
  - **Azure Computer Vision** (Receipt scanning)
  - **Payments External APIs** (Utility providers)
  - **Auth0** (Authentication service)


### 3. Deployment

- Entire frontend is **deployed on Vercel**.
- Vercel provides **scalability**, **automatic HTTPS**, and **fast global distribution**.


## **Backend Design Specifications**

### Proof of Concepts

**POC 1 – Handler Redesign**
- **Problem**: Initial handlers had mixed responsibilities and manually managed middleware, violating SOLID principles.
- **Solution**: An `AbstractHandler` class was created to centralize middleware execution and error handling. Specific handlers such as `getPaymentHandler` and `createPaymentHandler` inherit from it and focus solely on business logic.
- **Impact**: Improved code maintainability, cleaner separation of concerns, and easier error tracking.

**POC 2 – Documentation Upgrade**
- **Problem**: The original README lacked detailed setup, deployment instructions, and troubleshooting.
- **Solution**: The README was expanded to explain project purpose, local setup, deployment, and common problems with solutions.
- **Impact**: Accelerated onboarding for new developers and reduced environment setup errors.

**POC 3 – Logger Abstraction**
- **Problem**: Usage of `console.log` scattered across the codebase, unsuitable for production.
- **Solution**: Introduced an `ILogger` interface and a `ConsoleLogger` implementation using the Strategy Pattern.
- **Impact**: Enabled structured, flexible, and environment-specific logging, enhancing system observability.

**POC 4 – Middleware Chain Implementation**
- **Problem**: Hardcoded middleware inside handlers with no flexibility.
- **Solution**: Designed a dynamic middleware execution chain supporting mandatory and optional middlewares (e.g., logger based on environment variable `USE_LOGGER`).
- **Impact**: Simplified middleware management, ensured modularity, and improved security enforcement.

**POC 5 – Repository Layer Refactor**
- **Problem**: Tight coupling between handlers and direct database access.
- **Solution**: Defined an `IPaymentRepository` interface and added a `PaymentService` layer. Concrete implementation `PaymentMSSQLRepository` connects to Azure SQL.
- **Impact**: Enhanced testing capability, flexibility in switching databases, and better compliance with DDD practices.

**POC 6 – Real Deployment and Testing**
- **Problem**: No deployment example or real environment validation in the initial template.
- **Solution**: Configured Serverless Framework deployment for AWS Lambda, connected it with Azure MSSQL, and validated full API flows using Postman.
- **Impact**: Ensured real-world readiness, validated complete system behavior, and demonstrated effective cloud integration.

### **Postman Testing:**

A collection of API tests was created in Postman to verify the system's behavior. The tests include:

- GET /payments – Retrieves all payments stored in the database and verifies structure and status code.
- POST /payments (valid input) – Creates a payment with all required fields and verifies correct insertion.
- POST /payments (missing fields) – Sends an incomplete request to validate input validation and error response.
- Unauthorized access – Calls endpoints without authorization headers to confirm the authentication middleware blocks access.

You can access the Postman collection here.

- **Link:** [`Postman Collection`](https://www.postman.com/docking-module-geologist-85553284/workspace/echopay/collection/40779938-777c5020-cdaf-4e4e-84f0-f86897c5530c?action=share&creator=40779938)

This complete deployment validates the system in a real environment, ensures end-to-end backend functionality, and documents integration between cloud services, Lambda functions, and persistent storage.

### Backend Architecture

1. **REST, GraphQL, gRPC, Monolithic, or Monolithic-MVC?**  
   We will use a Monolithic-MVC architecture based on REST, utilizing Next.js API Routes. This allows us to centralize the backend while maintaining a clean layer separation (controllers, services, data access), making it easier to maintain without complicating deployment or collaborative development.

2. **Serverless, Cloud, On-Premise, or Hybrid?**  
   We have chosen a Serverless architecture deployed on the cloud, using Vercel to host the backend.
This removes the need to manage infrastructure, automatically scales based on usage, and reduces costs during this early stage of the project.

3. **Service vs. Microservices?**  
   EchoPay adopts a Service (modular monolith) architecture.
The entire backend lives inside a single Next.js application, internally organized by modules.
This approach enables faster development and easier team collaboration.
If the system grows, the current modular structure would simplify a future migration to microservices by separating domain-specific responsibilities.

4. **Event-Driven, Queues, Brokers, Producer/Consumer, Pub/Sub?**  
   EchoPay will use an event-driven architecture to handle asynchronous tasks that do not require an immediate response, such as:

- Payment confirmation
- Notification sending
- User activity logging

Azure Service Bus will be used as the message broker.
Backend services will act as event producers, while consumers will process the events (e.g., sending emails or logging activities).
Both the Producer/Consumer and Pub/Sub patterns will be applied depending on the event type.

5. **API Gateway (Security & Scalability)?**  
   An API Gateway will be implemented mainly for security and control purposes.
The selected option is Azure API Management, as it aligns with our use of Azure MSSQL and offers:

- Centralized authentication with Auth0
- Rate limiting
- Traffic monitoring
- Error handling and redirection

This improves system scalability and protects the API against traffic spikes or unauthorized access.

### Data Layer Design

This section outlines all critical decisions made in the design of the data access layer for the EchoPay system.

### **1. Structural – Infrastructure, Architecture, DevOps, DataOps**

a) **Data Topology (OLTP, Master-Slave, Distributed, Replicated, Geo)**

- **Cloud service technology:**

  Azure SQL Database, single instance (primary), geo-replicated to a secondary Azure region for disaster recovery.

- **Object-oriented design patterns:**

  Not applicable (infra-level decision).

- **Class layers for data access:**

  API → Service Layer → Repository Layer → ORM (Sequelize) → Azure SQL.

- **Configuration policies/rules:**

    - Database hosted on Azure SQL.
    - Geo-replication enabled.
    - Access restricted by VNET and IP whitelisting to trusted services only (e.g., Vercel servers, Azure API Management).

- **Expected benefits:**

    - Fully managed service reduces maintenance overhead.
    - High availability and automatic disaster recovery.
    - Geo-replication ensures high availability and fast disaster recovery.
    - Azure SQL is mature, supports strong consistency and complex transactions.

- **Decision rationale:**

  We chose a single-instance OLTP setup with geo-replication because EchoPay demands high-speed transactional processing with strong   consistency. Alternatives like master-slave setups would introduce complexity for synchronization without offering critical benefits at our scale. Distributed databases (like CosmosDB or Spanner) were not chosen because they are optimized for massive global-scale systems, which would unnecessarily complicate operations and increase costs.

b) **Big Data Repositories**

- **Cloud service technology:**

  No Big Data repositories needed at this stage.

- **Object-oriented design patterns:**

  Not applicable.

- **Class layers for data access:**

  Not applicable.

- **Configuration policies/rules:**

    - No pipelines to Snowflake, Hive, Bigtable, or Data Lakes.
    - No ETL jobs currently scheduled.

- **Expected benefits:**

    - Lower complexity, faster development cycles.
    - Simpler infraestructure
    - Faster and cheaper development.

- **Decision rationale:**

  EchoPay focuses on real-time transactional data, not large-scale analytics. Implementing Big Data tooling like Snowflake or Hadoop   would bring unnecessary complexity and costs without immediate benefits. However, if future analysis needs arise, batch exports could be integrated.

c) **Database Engine (Relational vs NoSQL)**

- **Cloud service technology:**

  Azure SQL Database (Relational).

- **Object-oriented design patterns:**

  Repository and DAO patterns.

- **Class layers for data access:**

  Sequelize ORM → Azure SQL.

- **Configuration policies/rules:**

    - Data strongly typed and normalized (3NF).
    - Enforced referential integrity via foreign keys.

- **Expected benefits:**

    - Ensures ACID compliance and structured relationships.
    - Fits perfectly with transaction-heavy systems like EchoPay.

- **Decision rationale:**

  EchoPay manages sensitive financial transactions where data consistency and reliability are critical. NoSQL engines like MongoDB or DynamoDB offer flexibility but sacrifice strong consistency guarantees without heavy manual workarounds. Relational databases natively provide the strict consistency and transactional control EchoPay needs.

d) **Tenancy, Data Access Control, Privacy, and Security**

- **Cloud service technology:**

  Azure SQL Database, Azure Key Vault, Auth0 Identity Provider.

- **Object-oriented design patterns:**

  Strategy Pattern for tenant management; Builder Pattern for database connection factory (TenantManager).

- **Class layers for data access:**

  API Layer → TenantManager Layer → Service Layer → Repository Layer → Database Proxy.

- **Configuration policies/rules:**

1) **Sensitive Data Protection:**

    **Fields encrypted:**

    - Company contact information.
    - Payment configuration data for memberships.
    - User email addresses.

    **Fields hashed:**

    - All passwords and personal identification numbers (PINs).

    **Checksums applied:**

    - On transactions, payments, logs, and benefits tables.

2) **Multitenancy Isolation:**

    - EchoPay is a multitenant system by design.
    - Every data access passes through a TenantManager layer that enforces tenant context.
    - Services cannot directly access the database without tenant-scoped queries.
    - Database access restricted through a proxy layer; whitelisted services only.

3) **Additional Security Measures:**

    - Encryption keys managed in Azure Key Vault.
    - JWT authentication with RBAC policies enforced on services.
    - Secrets rotated regularly via DevOps processes.

- **Expected benefits:**

    - In case of database breach, encrypted and hashed information remains secure.
    - Strict tenant isolation prevents accidental or malicious data exposure.
    - Scalability across multiple tenants without duplicating databases.
    - Reduced infrastructure and maintenance costs.
    - Improved resilience against human error or coding mistakes.

- **Decision rationale:** 

  Given EchoPay’s multitenant architecture, isolating tenant data is critical for security and compliance. By enforcing access through a TenantManager layer and encrypting/hashing sensitive fields, the platform ensures that even in worst-case scenarios (e.g., breach or software bug), exposure is minimal and isolated. This design balances security, cost efficiency, and scalability as the system grows.

e) **Recovery and Fault Tolerance**

- **Cloud service technology:**

  Azure SQL backup services + geo-replication.

- **Object-oriented design patterns:**

  Retry pattern for transient failures.

- **Class layers for data access:**

  Error Handler → Retry Service → Repository Layer.

- **Configuration policies/rules:**

    - Automated backups with 30-day retention.
    - Point-in-time recovery enabled.
    - Active geo-replication for disaster recovery.

- **Expected benefits:**

    - Minimal downtime.
    - Rapid recovery from failures.
    - Reduced risk of data loss.

- **Decision rationale:**

  High availability is non-negotiable for a financial app. We chose Azure’s native backup and replication features because they are deeply integrated, easy to manage, and remove the need to build complex, costly custom recovery systems.

**2. Object-Oriented Design – Programming Layer**

a) **Transactional Control: Statements vs Stored Procedures**

- **Cloud service technology:**

  Azure SQL.

- **Object-oriented design patterns:**

  Unit of Work.

- **Class layers for data access:**

  Service Layer → Repository Layer.

- **Configuration policies/rules:**

  Sequelize transaction methods (beginTransaction, commit, rollback) used for multi-step operations.

- **Expected benefits:**

    - Centralized logic control in application code.
    - Easier to maintain and extend as business rules evolve.

- **Decision rationale:**

  Stored procedures are harder to version, test, and debug compared to application-layer logic. By handling transactions inside the service layer, we maintain flexibility and better visibility over business processes.

b) **ORM Usage**

- **Cloud service technology:**

  Sequelize ORM.

- **Object-oriented design patterns:**

  Active Record + Repository.

- **Class layers for data access:**

  Sequelize Models → Repository Layer.

- **Configuration policies/rules:**

    - Models mapped using Sequelize syntax.
    - Migrations handled through Sequelize CLI.

- **Expected benefits:**

    - Fast development.
    - Safer queries.
    - Strong TypeScript typing.

- **Decision rationale:**

  Using Sequelize allows us to abstract database operations while enforcing schema definitions. Alternatives like raw SQL or using TypeORM were considered but rejected: Sequelize better matches our Node.js ecosystem, has mature documentation, and offers simpler transaction handling.

c) **Connection Pooling**

- **Cloud service technology:**

  Sequelize connection pooling with tedious driver.

- **Object-oriented design patterns:**

  Singleton Connection Manager.

- **Class layers for data access:**

  Connection Manager → ORM → Database.

- **Configuration policies/rules:**

    - Initial Pool: 5 connections.
    - Max Pool: 30 connections.
    - Dynamic scaling based on serverless concurrency.

- **Expected benefits:**

    - Prevents database overload.
    - Improves response time in serverless environments.

- **Decision rationale:**

  Serverless functions spawn multiple instances; without connection pooling, we'd quickly hit database connection limits. Pooling maintains stability without overloading the DB.

d) **Caching**

- **Cloud service technology:**

  Azure Redis Cache (planned).

- **Object-oriented design patterns:**

  Cache-Aside Pattern.

- **Class layers for data access:**

  Service Layer → Cache Layer → Repository Layer.

- **Configuration policies/rules:**

    - Key pattern: {entity}:{id} (e.g., user:12345).
    - TTL set to 5 minutes.

- **Expected benefits:**

    - Faster read operations.
    - Lighter load on Azure SQL.

- **Decision rationale:**

  Read-heavy endpoints like transaction history will benefit from caching. Redis offers sub-millisecond responses and simple integration with Node.js. Alternatives like in-memory cache (e.g., LRU cache) were rejected because they don't persist across serverless invocations.

e) **Drivers: Native vs Interpreted**

- **Cloud service technology:**

  `tedious` native driver for MSSQL.

- **Object-oriented design patterns:**

  Not applicable.

- **Class layers for data access:**

  Sequelize ORM → Database.

- **Configuration policies/rules:**

  Using native `tedious` driver for Sequelize compatibility.

- **Expected benefits:**

  - Faster, more stable connections.
  - Full feature support with Azure SQL.

- **Decision rationale:**

  Native drivers reduce latency and ensure compatibility with all Azure SQL features. Interpreted drivers (like ODBC bridges) were rejected because they add extra layers and increase connection times.

f) **Data Design**

This section presents the core data design principles for EchoPay. It focuses on the key parts of the system's data structure that developers must be familiar with, ensuring consistency, scalability, and strong security practices across the platform.

##### 1. General Data Modeling Conventions

- All tables will use **UUIDs** as their primary keys to ensure global uniqueness.
- **Third Normal Form (3NF)** will be enforced to maintain data integrity and avoid redundancy.
- Every table will include standard audit fields: `created_at`, `updated_at`, and optionally `deleted_at` for soft deletion.
- Sensitive information like **user emails** and **bank account numbers** will be **encrypted**.
- **Passwords** will always be **hashed** using industry best practices.
- **Foreign keys** will be used to enforce relationships between tables.

These conventions are designed to support a secure, efficient, and maintainable system as EchoPay grows.


##### 2. Key Table Designs

`Users`
Stores basic user information and authentication data.

| Field          | Type           | Notes                      |
|----------------|----------------|-----------------------------|
| id             | UUID            | Primary Key                |
| email          | VARCHAR(255)    | Encrypted, Unique           |
| password_hash  | VARCHAR(255)    | Hashed                     |
| created_at     | DATETIME        | Creation timestamp         |
| updated_at     | DATETIME        | Update timestamp           |
| deleted_at     | DATETIME        | Soft deletion timestamp (optional) |


`BankAccounts`
Represents users' linked bank accounts for processing payments.

| Field           | Type           | Notes                      |
|-----------------|----------------|-----------------------------|
| id              | UUID            | Primary Key                |
| user_id         | UUID            | Foreign Key → Users(id)    |
| bank_name       | VARCHAR(255)    | Bank name                  |
| account_number  | VARCHAR(255)    | Encrypted                  |
| account_type    | VARCHAR(50)     | (e.g., Checking, Savings)  |
| created_at      | DATETIME        | Creation timestamp         |


`Services`
Defines the services that users can pay for, such as utilities or municipal services.

| Field           | Type           | Notes                      |
|-----------------|----------------|-----------------------------|
| id              | UUID            | Primary Key                |
| name            | VARCHAR(255)    | Service name (e.g., Electricity) |
| provider_name   | VARCHAR(255)    | Name of service provider (e.g., CNFL) |
| service_type    | VARCHAR(100)    | Type (Utility, Municipality, etc.) |
| created_at      | DATETIME        | Creation timestamp         |


`Payments`
Captures the details of scheduled and completed payments.

| Field            | Type           | Notes                      |
|------------------|----------------|-----------------------------|
| id               | UUID            | Primary Key                |
| user_id          | UUID            | Foreign Key → Users(id)    |
| service_id       | UUID            | Foreign Key → Services(id) |
| bank_account_id  | UUID            | Foreign Key → BankAccounts(id) |
| amount           | DECIMAL(10,2)   | Payment amount             |
| status           | VARCHAR(50)     | (Pending, Completed, Failed) |
| scheduled_date   | DATE            | Scheduled payment date     |
| paid_at          | DATETIME        | Actual payment date        |
| created_at       | DATETIME        | Creation timestamp         |


`PaymentLogs`
Logs important events related to each payment (e.g., payment executed, failed, retried).

| Field          | Type           | Notes                      |
|----------------|----------------|-----------------------------|
| id             | UUID            | Primary Key                |
| payment_id     | UUID            | Foreign Key → Payments(id) |
| action         | VARCHAR(255)    | Action performed           |
| details        | TEXT            | Optional details (JSON string) |
| created_at     | DATETIME        | Creation timestamp         |


`Notifications`
Represents user notifications for various events (e.g., payment confirmations, failures).

| Field          | Type           | Notes                      |
|----------------|----------------|-----------------------------|
| id             | UUID            | Primary Key                |
| user_id        | UUID            | Foreign Key → Users(id)    |
| type           | VARCHAR(100)    | Notification type (Push, SMS, Voice) |
| message        | TEXT            | Notification message       |
| sent_at        | DATETIME        | Timestamp when sent        |
| status         | VARCHAR(50)     | (Sent, Failed)              |


##### 3. Key Relationships

- A **User** can have multiple **BankAccounts**.
- A **User** can schedule multiple **Payments**.
- A **Payment** is linked to one **User**, one **Service**, and one **BankAccount**.
- A **Payment** can have multiple **PaymentLogs** to track its status changes over time.
- A **User** can receive multiple **Notifications**.

These relationships help maintain a clear and organized data structure while supporting the business rules of EchoPay.


##### 4. Entity-Relationship Diagram

![Texto alternativo](./assets/ModeloGeneral.JPG)


> **Note:**  
This design focuses on the core tables critical to EchoPay’s operation. Additional tables and refinements may be introduced later during detailed database modeling or as new features are added.



## Architecture Design

The following diagram illustrates the high-level and detailed architecture of the EchoPay system solution:

![Texto alternativo](./assets/ArchitectureDesign.png)

The architecture shows:

- All designed layers: Frontend Layer (Next.js/TypeScript with React, Tailwind CSS, Auth0 SDK), API Gateway Layer (AWS API Gateway), Backend Layer (Node.js/Express in AWS) subdivided into API/Controllers (Middleware, Chain of Responsibility, Controller patterns), DAL/Repositories (Repository pattern), BLL/Services (Facade pattern), and External Clients/Adapters (Adapter pattern), Data Layer (Azure SQL/MSSQL), and External Services Layer (Azure Cognitive Services, Auth0). All components are contained within a Cloud Services Layer.
- Object patterns and involved classes: Each backend sublayer demonstrates design patterns and example classes/modules (e.g., abstractHandler, authMiddleware, PaymentRepository, paymentService, voiceCommandService, PaymentGatewayAdapter, AzureSpeechAdapter).
- System behavior under external stimuli: The diagram mainly captures the static structure and request propagation from user interactions (browser) through all layers, although dynamic sequences for errors or asynchronous events are not explicitly shown.
- Required cloud services and libraries: AWS API Gateway, Azure SQL Database, Azure Cognitive Services (Text-To-Speech, Computer Vision), Auth0 Identity Management, along with critical libraries like React, Next.js, Node.js, Express.js, AWS SDK, Azure SDK, and Auth0 SDK.
- Architectural patterns used: N-Layered Architecture at the system level, combined with Middleware, Chain of Responsibility, Controller, Repository, Facade, and Adapter patterns within backend layers.
- Consistent color and symbol coding: Each layer is color-coded for clarity (Frontend - blue, Gateway - pink, Backend - red, Data Layer - purple, External Services - green, Cloud Container - light blue) with uniform boxes and arrows to indicate structure and flow.
- Top-down structure: Requests flow vertically from the Web Browser through Frontend, API Gateway, and Backend Layers, while Data and External Services are connected laterally to the backend.
- Communication protocols and cloud zones: Key protocols are noted (HTTPS between Browser and Frontend, RESTful API Calls between Frontend and Gateway). The system demonstrates a multi-cloud deployment: backend services on AWS, database services on Azure.
- Key architecture attributes: Scalability, security, and maintainability are implied through the use of API Gateways, modular backend services, adapters, and cloud resource separation, although not explicitly annotated in the diagram.
- Clear communication of analysis results: The structure, color coding, and labeling present the architecture clearly and effectively, communicating the major design choices and system organization.

## Architecture Compliance Matrix

The following matrix illustrates how the selected architectural decisions fulfill the main functional and non-functional requirements of the system:

![Architecture Compliance Matrix](assets/Architecture_Compliance_Matrix.JPG)

Each "X" in the matrix indicates that the corresponding component or design pattern significantly contributes to meeting the specific requirement.
