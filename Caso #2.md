# System name - set your own name
Members
- Luis Fernando Ureña Corrales - 2023064329
- Luis Alejandro Masís Pérez - 
- Nicole Tatiana Parra Valverde - 2023223291
- Danielo Wu Zhong - 2023150448

## Description:


## Stack:


## Frontend design specifications


---

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

- AUTH0_SECRET= secret-generated-with-openssl
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
The demo application includes login and logout buttons. When clicking the Login button, the app redirects the user to the Auth0-hosted login screen. Upon successful authentication, the user is redirected back to the application.

After logging in, user profile information is displayed, demonstrating that authentication was successful and session management is working correctly.

#### 7. Customizing the Auth0 Login Interface

Auth0 provides a hosted login page that can be customized directly from the Auth0 Dashboard. Here's how the customization process was carried out:

1. **Accessing the Universal Login Settings**
     
   From the Auth0 Dashboard:
   - Navigate to **Branding** > **Universal Login**.
   - Select the **Login** tab.

3. **Selecting the Customization Mode**  
   Auth0 offers two modes:
   - **Classic**: Allows full customization using custom HTML, CSS, and JavaScript.
   - **New Universal Login Experience**: A modern, streamlined experience with limited visual customization but easier to configure.

   For this demo, the **New Universal Login Experience** was used to keep the configuration simple and consistent with current best practices.

4. **Customizing the Login Page**  
   - The logo and primary color were changed under **Branding > Universal Login > Advanced Options > Customize**.
   - Additional UI elements like the title, background color, and button style can be adjusted using the branding options.
   - If using **Classic**, a custom HTML template can be provided to fully style the login experience.

5. **Saving and Previewing**  
   After making the desired changes, the updated login screen was previewed and saved. When logging in from the local app, the changes were reflected immediately in the hosted login page.

---

### Postman Requests

You can view or import the full Postman collection for this flow here:  
[Postman Collection - Login Flow](https://www.postman.com/maintenance-cosmonaut-70125097/workspace/auth0-mfa-demonstation/collection/44091561-a8ed4c1a-0747-4ae7-92ac-774f1fe6ea03?action=share&creator=44091561)

#### Request 1

The first request initiates a login attempt by providing only the username and password in the request body. This is a standard initial step in many authentication flows. However, in this case, the response does not return an access token immediately. Instead, the response includes an error message indicating that multifactor authentication (MFA) is required.

The error field in the response contains the value mfa_required, and the description clearly states that "Multifactor authentication is required." This is a clear indicator that the Auth0 tenant has MFA enforcement enabled and correctly blocks access until the second authentication factor is verified.

In addition to the error, the response includes an MFA token. This token is not an access token and does not grant access to protected resources. Instead, it is a short-lived token that represents a pending MFA challenge. It must be included in a subsequent request, where the user will provide the second authentication factor (such as a one-time password from an authenticator app or another supported method).

This request serves to confirm several things:

- That the system is enforcing MFA correctly.

- That users cannot authenticate using only a username and password.

- That the correct error and challenge flow is initiated by returning an mfa_token.

#### Request 2

The second request completes the authentication flow by exchanging a **verification code** for tokens. This is a crucial step in the **Authorization Code Flow** with Auth0, a commonly used method for secure user authentication in production environments. The purpose of this request is to exchange the authorization code obtained from the user’s successful login and Multi-Factor Authentication (MFA) for the necessary tokens that will be used to authorize subsequent API requests and provide user-related information.

The request is made to Auth0's `/oauth/token` endpoint with the following fields in the body:

- **`grant_type`**: Set to `authorization_code`. This indicates that the client is attempting to exchange an authorization code for an access token. This step is part of the **Authorization Code Flow**, which is one of the most secure OAuth 2.0 flows.
- **`code`**: This is the verification code received after the user successfully completes the MFA challenge. It is a one-time use code that was generated by Auth0 during the authorization phase.
- **`redirect_uri`**: This must be the same as the redirect URI used during the authorization request, and it must match what has been configured in the Auth0 dashboard. This ensures that the request is legitimate and not being tampered with.
- **`client_id`** and **`client_secret`**: These are the credentials of your application. They are used to identify and authenticate your app to Auth0. The `client_id` uniquely identifies your app, while the `client_secret` is used to prove that the request is coming from the actual app and not from an attacker.

This verification code (`code`) is obtained through the following process:

1. **Start the development server**:
   - You need to start the server with the command `npm run dev`. This will run your application locally and allow you to proceed with the authentication flow.

2. **Open the Auth0 authorization URL**:
   - In your browser, open the following URL, which is Auth0’s authorization endpoint. This URL includes all the necessary parameters for the initial authentication request:

https://dev-5dp1b6y0xuwqglt1.us.auth0.com/authorize? response_type=code& client_id=vC5teCwmKnpZA7cnybb87RXCaRwCoLPL& redirect_uri=http://localhost:3000/auth/callback& scope=openid%20profile%20email& audience=https://payment-assistant-api.com


Here's a breakdown of the query parameters:
- **`response_type=code`**: This specifies that the client expects an authorization code in response.
- **`client_id`**: The unique identifier for your application in Auth0.
- **`redirect_uri`**: The URI where the user will be redirected after completing the login. This URI should match the one set up in the Auth0 application configuration.
- **`scope`**: Defines the permissions the application is requesting. In this case, the `openid`, `profile`, and `email` scopes are requested.
- **`audience`**: This refers to the API that the tokens will grant access to. In this case, it is the Payment Assistant API.

3. **Login using the test user**:
- Once the page loads, log in using the **test credentials** provided for this example:
  - **Email**: `danielowu1012@gmail.com`
  - **Password**: `b-uvWDqu3XJBuUY`

The user will be prompted to enter these details. After successful login, MFA will be triggered.

4. **Multi-Factor Authentication (MFA)**:
- After entering the username and password, the user will be prompted for the **One-Time Password (OTP)** as part of the MFA challenge. This is a security measure to verify the identity of the user.
- The OTP is typically sent via an authentication app (like Google Authenticator or Auth0’s Guardian app), or via email/SMS depending on your MFA setup.

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
  - **`client_id` and `client_secret`**: Your app’s client credentials.

8. **Successful Authentication Response**:
- If everything is set up correctly and the request is valid, Auth0 will respond with a payload containing several important pieces of information:
  - **`access_token`**: This token is used to authorize API requests. It must be included in the authorization header of subsequent API calls.
  - **`id_token`**: This token contains information about the authenticated user, such as their name, email, and other profile details.
  - **`scope`**: The permissions granted to the application, which are defined during the authorization request. In this case, the scopes are `openid`, `profile`, and `email`.
  - **`expires_in`**: The time in seconds until the access token expires.
  - **`token_type`**: Typically set to `Bearer`, indicating that the token is a bearer token.

9. **Outcome**:
- After receiving the access token and id token, your client application can use them to authenticate API requests and gain access to protected resources. This confirms that the user has been successfully authenticated using the **Authorization Code Flow** with MFA.

This step ensures that the authentication flow, including both password-based login and multi-factor authentication, is working properly. By using the verification code, the client can securely obtain tokens that are required for subsequent interactions with protected resources.

---

## Client Architecture:

EchoPay will follow an N-layer architecture, as it utilizes APIs to separate concerns between the presentation layer (frontend), the business logic (backend), and data access (database). 

Technology used to implement this architecture: 

  - Frontend: React + TypeScript + Tailwind CSS 
  - Backend: Next.js API Routes 
  - Database: Azure MSSQL 

This architecture allows for better modularity, scalability, and maintainability, and it facilitates future integration with other clients such as mobile applications. 

#### Mobile Development: 
Currently, the system is focused solely on web application development. No mobile version is planned at this stage. If mobile development is considered in the future, a hybrid approach (shared code base) using React Native will be chosen, allowing code reuse across platforms. 

#### Web App Rendering: 
EchoPay will primarily use Client-Side Rendering (CSR) to provide a fast and interactive user experience. 
However, since the system uses Next.js, Server-Side Rendering (SSR) can also be applied selectively for specific pages where SEO or initial load performance is a concern. 

## Visual Components 

#### Patterns & Principles 

Para diseñar y construir los componentes visuales de EchoPay, vamos a seguir los siguientes patrones y principios, adaptados a nuestro stack (React + Tailwind + TypeScript): 

  - SOLID (must): Cada componente tendrá una sola responsabilidad clara, evitando que tenga múltiples funciones mezcladas. 
  - DRY (must): Reutilizaremos componentes y lógica donde sea posible para evitar duplicación de código. 
  - Separation of Concerns (must): Separaremos la lógica del negocio, la visual y los estilos. Por ejemplo, usando hooks para lógica y componentes puros para la presentación. 
  - Responsive Design (must): Toda la interfaz se diseñará para adaptarse bien a distintos tamaños de pantalla, aprovechando las utilidades de Tailwind CSS. 
  - Atomic Design (all): Organizaremos nuestros componentes en niveles: átomos (botones, inputs), moléculas (formularios simples), organismos (secciones completas como un formulario de pago), templates y páginas. 
  - MVVM (React): Aunque React no sigue MVVM de forma estricta, lo usaremos como guía separando la vista (JSX), la lógica de presentación (hooks) y el acceso a datos o servicios. 
  - State Management Pattern (web): Usaremos estado local (useState, useContext, useReducer) para componentes simples. Si en el futuro el manejo de datos se vuelve más complejo, vamos a integrar Redux Toolkit por su buena compatibilidad con TypeScript y Next.js. 

#### Toolkits and Standards 

  - Tailwind CSS: Será la base para aplicar estilos de forma rápida, limpia y con buen control responsivo. 
  - Storybook: Nos permitirá trabajar componentes visuales de forma aislada y documentarlos para el equipo. 
  - Chakra UI (opcional): Podría usarse para agilizar diseño de ciertos componentes si se necesita velocidad en el desarrollo. 
  - Material Design: Lo tomaremos como referencia visual para consistencia, jerarquía y accesibilidad. 
  - Vercel: Será la plataforma de despliegue del frontend, aprovechando su integración con Next.js para CI/CD y previsualizaciones automáticas.


##  Backend Architecture 

1. **REST, GraphQL, gRPC, Monolithic, or Monolithic-MVC?**  
Usaremos una arquitectura Monolithic-MVC basada en REST utilizando las API Routes de Next.js. Esto nos permite tener todo el backend centralizado, pero bien organizado en capas (controladores, servicios, acceso a datos), lo cual facilita el mantenimiento sin complicar el despliegue ni el desarrollo colaborativo.

2. **Serverless, Cloud, On-Premise, or Hybrid?**  
Elegimos una arquitectura Serverless en la nube, usando Vercel para desplegar el backend.  
Esto elimina la necesidad de administrar infraestructura, escala automáticamente según el uso, y reduce costos en esta etapa temprana del proyecto.

3. **Service vs. Microservices?**  
EchoPay usa una arquitectura de tipo Service (monolito modular). Todo el backend vive en una sola aplicación Next.js, organizada internamente por módulos.  
Esta opción permite rapidez en el desarrollo y facilidad para colaborar en equipo. En caso de que el sistema crezca, esta estructura facilita una futura migración hacia microservicios si se vuelve necesario dividir responsabilidades por dominio.

4. **Event-Driven, Queues, Brokers, Producer/Consumer, Pub/Sub?**  
EchoPay usará una arquitectura event-driven para manejar tareas que no necesitan respuesta inmediata, como:

  - Confirmación de pagos 
  - Envío de notificaciones
  - Registro de actividad del usuario 

Se utilizará Azure Service Bus como broker de mensajes. Los servicios del backend actuarán como productores que envían eventos, y habrá consumidores que procesan esos eventos (por ejemplo, enviar un correo o guardar un log). 
Se aplicarán los patrones Producer/Consumer y Pub/Sub, según el tipo de evento. 

5. **API Gateway (Security & Scalability)?**  
Se usará un API Gateway, principalmente por razones de seguridad y control.  
La opción elegida es Azure API Management, ya que se alinea con el uso de Azure MSSQL y podría gestionar:
  - Autenticación centralizada con Auth0 
  - Rate limiting 
  - Monitoreo de tráfico 
  - Manejo de errores y redirección 

Esto mejora la escalabilidad del sistema y protege la API ante picos de uso o accesos no autorizados. 
