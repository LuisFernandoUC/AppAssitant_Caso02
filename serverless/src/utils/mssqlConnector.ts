// utils/mssqlConnector.ts
import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig: sql.config = { // Configuración de la conexión a la base de datos
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_SERVER!,
    database: process.env.DB_NAME,
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

let pool: sql.ConnectionPool | null = null; // Pool de conexiones a la base de datos

export const getConnection = async (): Promise<sql.ConnectionPool> => { // Función para obtener una conexión al pool de la base de datos
    if (!pool) {
        pool = await sql.connect(dbConfig); // Si no hay un pool existente, crea uno nuevo
    }
    return pool;
};
