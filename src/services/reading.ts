import { command, multiQuery, query } from "../assets/db/config/mysql";
import { IReading } from "../models/interfaces/reading";
import { createSQLParameters, prepareBulkInsertQuery } from "./helpers/util";

export const getReadings = async (deviceId: string): Promise<IReading[]> => {
    const params = createSQLParameters({ deviceId });
    const data = await query(
        `SELECT 
            readings.id,
            readings.createdOn,
            readings.value,
            readings.high,
            readings.low,
            sensors.name,
            sensors.serialNumber
             
        FROM
            readings
        INNER JOIN
            sensors
        ON 
            readings.sensorId = sensors.id
        WHERE 
            sensors.deviceId = ?;`,
        params) as IReading[];
    return data;
}

export const getReadingsByTimeInterval = async (deviceId: string): Promise<void> => {

}

export const getReadings24Hours = async (deviceId: string): Promise<Partial<IReading>[]> => {
    const params = createSQLParameters({ deviceId });
    const data = await query(
        `SELECT
            HOUR(createdOn) AS time,
            sensorId AS sensor,
            AVG(value) AS value
        FROM 
            readings
        WHERE
            createdOn > DATE_SUB(NOW(), INTERVAL 24 HOUR)
        GROUP BY 
            hour(createdOn),
            sensorId
        ORDER BY
            createdOn ASC;`,
        params) as Partial<IReading>[];
    return data;
}

export const getReadingsLast30Days = async (deviceId: string): Promise<Partial<IReading>[]> => {
    const params = createSQLParameters({ deviceId });
    const data = await query(
        `SELECT
            CONCAT(DAY(createdOn), "/", MONTH(createdOn)) AS time,
            sensorId AS sensor,
            AVG(value) AS value
        FROM 
            readings
        WHERE
        createdOn > DATE_SUB(NOW(), INTERVAL 720 HOUR)
        GROUP BY 
            day(createdOn),
            sensorId
        ORDER BY
            createdOn ASC;`,
        params) as Partial<IReading>[];
    return data;
}

export const postReading = async (data: Partial<IReading>): Promise<void> => {
    try {
        //Demo, izbrisati poslije
        if (data && data.value) {
            data.value += Math.random() || 10;
            data.value = Math.round(data.value * 10000) / 10000;
        }
        const params = createSQLParameters(data);
        await command(
            `INSERT INTO
            readings
                (
                    value,
                    sensorId,
                    high,
                    low
                )
        VALUES
                (
                    ?,
                    ?,
                    ?,
                    ?
                );`,
            params);
    } catch (error) {
        throw new Error(JSON.stringify(error));
    }
}

export const syncReadings = async (data: Partial<IReading>[]): Promise<void> => {
    try {
        const query = `INSERT INTO
        readings
            (
                id,
                isDeleted,
                createdOn,
                value,
                sensorId,
                high,
                low
            )
    VALUES
            (   
                ?,
                ?,
                DATE(?),
                ?,
                ?,
                ?,
                ?
            );`;

        const { queries, params } = prepareBulkInsertQuery(query, data || {});

        await multiQuery(queries, params);
    } catch (error) {
        throw new Error(JSON.stringify(error));
    }

}