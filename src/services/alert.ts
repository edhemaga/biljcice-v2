import { query } from "../assets/db/config/mysql";

import { IAlert, IAlertExtended } from "../models/interfaces/alert";
import { IBaseRequest, ICount } from "../models/interfaces/util/base-data";

import { calculateOffset } from "./helpers/util";

export const getAlerts = async (requestData: IBaseRequest): Promise<{ data: IAlertExtended[], count: number }> => {

    const deviceId = requestData.filter;

    const data = await query(
        `SELECT 
                alerts.id,
                alerts.severity,
                readings.value,
                readings.high,
                readings.low,
                sensors.name,
                sensors.type
            FROM
                alerts
            INNER JOIN
                readings
            ON
                alerts.readingId = readings.id
            INNER JOIN
                sensors
            ON
                readings.sensorId = sensors.id
            WHERE
                sensors.deviceId = '${deviceId}'
            ORDER BY 
                readings.createdOn 
            DESC
            LIMIT
                ${requestData.pageSize} 
            OFFSET 
                ${calculateOffset(requestData)};`) as IAlertExtended[];

    const dataCount = await query(
        `SELECT 
            COUNT(alerts.id) AS count
        FROM
            alerts
        INNER JOIN
            readings
        ON
            alerts.readingId = readings.id
        INNER JOIN
            sensors
        ON
            readings.sensorId = sensors.id
        WHERE
            sensors.deviceId = '${deviceId}'`) as ICount[];

    const count: number = dataCount[0].count ?? 0;
    
    return { data, count };

    // throw new Error(JSON.stringify(error));
}

export const getAlertBySeverityInLast24Hours = async (deviceId: string) => {
    try {

    } catch (error) {
        throw new Error(String(error));
    }
    const data = await query(
        `SELECT
            COUNT(alerts.id) AS count,
            alerts.severity AS severity
        FROM
            alerts
        INNER JOIN
            readings
        ON
            alerts.readingId = readings.id
        INNER JOIN
            sensors
        ON
            readings.sensorId = sensors.id
        WHERE
            sensors.deviceId = '${deviceId}'
        AND
            readings.createdOn > DATE_SUB(NOW(), INTERVAL 24 HOUR)
        GROUP BY
            alerts.severity
        ORDER BY
            alerts.severity DESC;`
    );
    return data;
}

export const getAlertBySeverity = async (deviceId: string) => {
    try {

    } catch (error) {
        throw new Error(String(error));
    }
    const data = await query(
        `SELECT
            COUNT(alerts.id) AS count,
            alerts.severity AS severity
        FROM
            alerts
        INNER JOIN
            readings
        ON
            alerts.readingId = readings.id
        INNER JOIN
            sensors
        ON
            readings.sensorId = sensors.id
        WHERE
            sensors.deviceId = '${deviceId}'
        GROUP BY
            alerts.severity        
        ORDER BY
            alerts.severity DESC;`
    ) as IAlert[];
    return data;
}