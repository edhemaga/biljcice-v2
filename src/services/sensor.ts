import { command, query } from "../assets/db/config/mysql";
import { ISensor } from "../models/interfaces/sensor";
import { IBaseRequest, IBaseResponse } from "../models/interfaces/util/base-data";
import { calculateOffset, createSQLParameters } from "./helpers/util";

export const getSensors = async (requestData: IBaseRequest): Promise<IBaseResponse<ISensor[]>> => {
    const deviceId = requestData.filter;
    const queryy = `SELECT
    id,
    status,
    createdOn,
    updatedOn,
    name,
    manufacturer,
    price,
    high,
    low,
    type,
    serialNumber
FROM 
    sensors
WHERE
    isDeleted = FALSE
AND
    deviceId = '${deviceId}'
ORDER BY 
    createdOn 
DESC
LIMIT
    ${requestData.pageSize} 
OFFSET 
    ${calculateOffset(requestData)};`

    const data = await query(
        `SELECT
            id,
            status,
            createdOn,
            updatedOn,
            name,
            manufacturer,
            price,
            high,
            low,
            type,
            serialNumber
        FROM 
            sensors
        WHERE
            isDeleted = FALSE
        AND
            deviceId = '${deviceId}'
        ORDER BY 
            createdOn 
        DESC
        LIMIT
            ${requestData.pageSize} 
        OFFSET 
            ${calculateOffset(requestData)};`
    ) as ISensor[];

    const response: IBaseResponse<ISensor[]> = {
        message: "Data successfully fetched!",
        status: 200,
        data: data,
    };

    return response;
};

export const getSensor = async (id: string): Promise<ISensor[]> => {
    const data = await query(
        `SELECT
            id,
            status,
            createdOn,
            updatedOn,
            name,
            manufacturer,
            price,
            type,
            serialNumber,
            high,
            low
        FROM 
            sensors
        WHERE
            isDeleted = FALSE
        AND
            id = '${id}';`
    );
    return data as ISensor[];
};

export const addSensor = async (sensorToAdd: ISensor): Promise<void> => {
    const params = createSQLParameters(sensorToAdd);
    await command(
        `INSERT INTO 
            sensors (
                status,
                name,
                manufacturer,
                price,
                type,
                serialNumber,
                high,
                low,
                deviceId
            ) 
        VALUES 
            (
                1,
                ?,
                ?,
                ?,
                1,
                ?,
                ?,
                ?,
                ?
            );`,
        params
    );
};

export const updateSensor = async (sensor: Partial<ISensor>, sensorId: string): Promise<void> => {
    const params = createSQLParameters(sensor);
    await command(
        `UPDATE
            sensors
        SET
            name = ?,
            manufacturer = ?,
            high = ?,
            low = ?
        WHERE
            id = '${sensorId}';`,
        params
    );
}

export const activateSensor = async (sensorId: string): Promise<void> => {
    const params = createSQLParameters(sensorId);
    await command(
        `UPDATE 
            sensors
        SET 
            status = 1 
        WHERE 
            id = ?;`,
        params
    );
};

export const deactivateSensor = async (sensorId: string): Promise<void> => {
    const params = createSQLParameters(sensorId);
    await command(
        `UPDATE 
            sensors
        SET 
            status = 2 
        WHERE 
            id = ?;`,
        params
    );
};

export const deleteSensor = async (sensorId: string): Promise<void> => {
    const params = createSQLParameters(sensorId);
    await command(
        `UPDATE 
            sensors
        SET 
            isDeleted = TRUE 
        WHERE 
            id = ?;`,
        params
    );
};
