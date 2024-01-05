import { command, query } from "../assets/db/config/mysql";
import { IDevice, IDeviceDTO } from "../models/interfaces/device"
import { IBaseRequest, IBaseResponse } from "../models/interfaces/util/base-data"
import { calculateOffset, createSQLParameters } from "./helpers/util";

export const getDevices =
    async (requestData: IBaseRequest): Promise<IBaseResponse<IDevice[]>> => {
        const userId = requestData.filter;
        const data = await query(
            `SELECT
            id,
            status,
            createdOn,
            updatedOn,
            geoLocation,
            activatedOn
        FROM 
            devices
        WHERE
            isDeleted = FALSE
        AND
            userId = '${userId}'
        ORDER BY 
            status 
        DESC
        LIMIT
            ${requestData.pageSize} 
        OFFSET 
            ${calculateOffset(requestData)};`
        ) as IDevice[];

        const response: IBaseResponse<IDevice[]> = {
            message: "Data successfully fetched!",
            status: 200,
            data: data,
        }

        return response;

    }

export const getDevice = async (id: string): Promise<IDevice[]> => {
    const data = await query(
        `SELECT
            id,
            status,
            createdOn,
            updatedOn,
            geoLocation,
            activatedOn
        FROM 
            devices
        WHERE
            isDeleted = FALSE
        AND
            id = '${id}';`);
    return data as IDevice[];
}

export const addDevice = async (deviceToAdd: Partial<IDevice>): Promise<void> => {
    const params = createSQLParameters(deviceToAdd);
    await command(
        `INSERT INTO 
            devices (
                status,
                userId,
                geoLocation
            ) 
        VALUES 
            (
                1,
                ?,
                ?
            );`,
        params)
}

export const activateDevice = async (deviceId: string): Promise<void> => {
    const params = createSQLParameters(deviceId);
    await command(
        `UPDATE 
            devices
        SET 
            status = 1 
        WHERE 
            id = ?;`,
        params);
}

export const deactivateDevice = async (deviceId: string): Promise<void> => {
    const params = createSQLParameters(deviceId);
    await command(
        `UPDATE 
            devices
        SET 
            status = 2 
        WHERE 
            id = ?;`,
        params);
}

export const deleteDevice = async (deviceId: string): Promise<void> => {
    const params = createSQLParameters(deviceId);
    await command(
        `UPDATE 
            devices
        SET 
            isDeleted = TRUE 
        WHERE 
            id = ?;`,
        params);
}