import { command, multiQuery, query } from "../assets/db/config/mysql";

import { IReading } from "../models/interfaces/reading";
import { IBaseRequest, ICount } from "../models/interfaces/util/base-data";

import { calculateOffset, createSQLParameters, prepareBulkInsertQuery } from "./helpers/util";

//TODO promijeniti povratni tip u IReadingExtended[]
export const getReadings = async (requestData: IBaseRequest): Promise<any> => {

    const deviceId = requestData.filter;

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
            sensors.deviceId = '${deviceId}'
        ORDER BY 
            readings.createdOn DESC
        LIMIT
            ${requestData.pageSize} 
        OFFSET 
            ${calculateOffset(requestData)};`) as IReading[];

    const dataCount = await query(
        `SELECT 
            COUNT(readings.id) AS count
        FROM
            readings
        INNER JOIN
            sensors
        ON 
            readings.sensorId = sensors.id
        WHERE 
            sensors.deviceId = '${deviceId}'`) as ICount[];
            
    const count: number = dataCount[0].count ?? 0;

    return { data, count };
}

export const getReadingsByTimeInterval = async (deviceId: string): Promise<void> => {

}

export const getReadings24Hours = async (deviceId: string): Promise<Partial<IReading>[]> => {
    const params = createSQLParameters({ deviceId });
    const data = await query(
        `SELECT
            HOUR(readings.createdOn) AS time,
            sensors.name AS sensor,
            AVG(readings.value) AS value
        FROM 
            readings
        INNER JOIN
            sensors
        ON
            readings.sensorId = sensors.id
        WHERE
            readings.createdOn > DATE_SUB(NOW(), INTERVAL 24 HOUR)
        GROUP BY 
            hour(readings.createdOn),
            readings.sensorId
        ORDER BY
            readings.createdOn ASC;`,
        params) as Partial<IReading>[];
    return data;
}

export const getReadingsLast30Days = async (deviceId: string): Promise<Partial<IReading>[]> => {
    const params = createSQLParameters({ deviceId });
    const data = await query(
        `SELECT
            CONCAT(DAY(readings.createdOn), "/", MONTH(readings.createdOn)) AS time,
            sensors.name AS sensor,
            AVG(readings.value) AS value
        FROM 
            readings
        INNER JOIN
            sensors
        ON
            readings.sensorId = sensors.id
        WHERE
        readings.createdOn > DATE_SUB(NOW(), INTERVAL 720 HOUR)
        GROUP BY
            day(readings.createdOn),
            readings.sensorId
        ORDER BY
            readings.createdOn ASC;`,
        params) as Partial<IReading>[];
    return data;
}

export const postReading = async (data: Partial<IReading>): Promise<void> => {
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
    try {
        //Demo, izbrisati poslije

    } catch (error) {
        throw new Error(JSON.stringify(error));
    }
}

export const syncReadings = async (data: Partial<IReading>[]): Promise<void> => {
    try {
        const query =
            `INSERT INTO
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