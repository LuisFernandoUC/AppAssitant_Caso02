-- Crear tabla Usuarios (puede enlazarse con Auth0)
CREATE TABLE Usuarios (
  id UNIQUEIDENTIFIER PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  nombre VARCHAR(100),
  fecha_creacion DATETIME DEFAULT GETDATE()
);

-- Cuentas bancarias por usuario
CREATE TABLE CuentasBancarias (
  id INT IDENTITY(1,1) PRIMARY KEY,
  usuario_id UNIQUEIDENTIFIER,
  banco VARCHAR(100),
  numero_cuenta VARCHAR(50),
  saldo DECIMAL(10,2),
  FOREIGN KEY (usuario_id) REFERENCES Usuarios(id)
);

-- Servicios
CREATE TABLE Servicios (
  id INT IDENTITY(1,1) PRIMARY KEY,
  nombre VARCHAR(100),
  categoria VARCHAR(50)
);

-- Pagos
CREATE TABLE Payments (
  id INT IDENTITY(1,1) PRIMARY KEY,
  userId VARCHAR(50),
  amount DECIMAL(10,2),
  date DATETIME,
  servicio VARCHAR(100),
  createdAt DATETIME DEFAULT GETDATE()
);

-- Confirmaciones
CREATE TABLE Confirmaciones (
  id INT IDENTITY(1,1) PRIMARY KEY,
  pago_id INT,
  metodo VARCHAR(50),
  confirmado BIT,
  fecha DATETIME,
  FOREIGN KEY (pago_id) REFERENCES Payments(id)
);
