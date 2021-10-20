import { Connection, createConnection, getConnectionOptions } from 'typeorm';

// (async () => await createConnection())();

export default async (host = 'database'): Promise<Connection> => {
    const defaultOptions = await getConnectionOptions();

    return createConnection(
        Object.assign(defaultOptions, {
            host,
            database: process.env.NODE_ENV === 'test' ? 'fin_api_test' : defaultOptions.database
        })
    )
}