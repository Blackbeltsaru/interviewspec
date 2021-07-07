import mysql, { Connection, RowDataPacket, OkPacket, Pool } from "mysql2/promise";

const CONNECTION_LIMIT = 10;

type DBState = {
    pool: Pool | null;
};

type dbDefaults = RowDataPacket[] | RowDataPacket[][] | OkPacket[] | OkPacket;
type dbQuery<T> = T & dbDefaults;

const state: DBState = {
    pool: null,
};

export function connect() {
    state.pool = mysql.createPool({
        connectionLimit: CONNECTION_LIMIT,
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB,
    });
};

export async function get(): Promise<Connection> {
    if (!state.pool) throw new Error("Missing database connection!");

    return await state.pool.getConnection();
};


//Taken from https://stackoverflow.com/questions/54583950/using-typescript-how-do-i-strongly-type-mysql-query-results
export const query = async <T>(query: string, params?: Array<any>): Promise<[T, any]> => {
    if (!state.pool) throw new Error("Missing database connection!");
    
    return state.pool.query<dbQuery<T>>(query, params);
};
