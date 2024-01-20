import mysql, { Connection, ConnectionOptions, ErrorPacketParams } from 'mysql2/promise';

//TODO prebaciti u env 
const access: ConnectionOptions = {
    user: "root",
    password: "admin",
    localAddress: "localhost",
    port: 3306,
    database: "biljcice"
};

const connect = async (): Promise<Connection> => {
    return await mysql.createConnection(access);
}

//Mediator pattern reference
export const query = async (query: string, params?: string[]) => {
    try {
        const conn = await connect();
        var result = (await conn.query(query, params || []))[0];
        return result;
    } catch (error) {
        throw new Error(JSON.stringify(error));
    }
}

export const command = async (query: string, params?: string[]) => {
    try {
        const conn = await connect();
        await Promise.all(
            [
                conn.beginTransaction(),
                conn.execute(query, params || []),
                conn.commit()
            ]
        );

    } catch (error) {
        throw new Error(JSON.stringify(error));
    }
}

export const multiQuery = async (queries: string[], params: string[][]) => {
    try {
        const conn = await connect();
        await Promise.all(
            [
                conn.beginTransaction(),
                queries.forEach((query, indx) => {
                    conn.execute(query, params[indx] || [])
                }),
                conn.commit()
            ]
        )
    } catch (error) {
        throw new Error(JSON.stringify(error));
    }
}

