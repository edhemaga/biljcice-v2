import { NextFunction, Request, Response } from 'express';
import { command, multiQuery, query } from '../assets/db/config/mysql';
import { ILoginResponse, IUser, IUserLogin } from '../models/interfaces/user';
import { calculateOffset, createSQLParameters, createToken, dehashPassword, hashPassword } from './helpers/util';
import { IBaseRequest, ICount } from '../models/interfaces/util/base-data';
import { IDevice } from '../models/interfaces/device';

//Pagination will be included in order not to overstrech SELECT 
export const getAllUsers = async (requestData: IBaseRequest): Promise<Partial<IUser>[]> => {
    const data = await query(
        `SELECT
            id,
            name,
            surname,
            email,
            phone,
            country,
            status 
        FROM 
            users
        WHERE
            isDeleted = FALSE
        ORDER BY 
            createdOn 
        DESC
        LIMIT
            ${requestData.pageSize} 
        OFFSET 
            ${calculateOffset(requestData)};`
    ) as Partial<IUser>[];

    if (!data) return [];

    return data;
}

export const getUser = async (id: string): Promise<Partial<IUser> | null> => {
    if (!id) return null;

    const data = await query(
        `SELECT * 
        FROM 
            users 
        WHERE 
            id = ${id};`
    ) as IUser[];

    if (!data) return null;
    return data[0] as IUser;
}

export const getUserWithDevices = async (id: string): Promise<Partial<IUser> | null> => {
    if (!id) return null;

    const users = await query(
        `SELECT 
            id,
            name,
            surname,
            email,
            phone,
            country
        FROM 
            users 
        WHERE 
            id = '${id}';`) as IUser[];

    const devices = await query(
        `SELECT
            id,
            status,
            createdOn,
            geoLocation
        FROM
            devices
        WHERE 
            userId = '${id}'
        AND
            isDeleted = FALSE`) as IDevice[];

    if (users.length === 0) return null;

    //Možda reducirati ovaj dio, ima li potrebe za svim ovim informacijama?
    const response: Partial<IUser> = {
        name: users[0].name,
        surname: users[0].surname,
        email: users[0].email,
        phone: users[0].phone,
        country: users[0].country,
        devices: [...devices]
    }

    return response;
}

//Ne vraća dobar error, pogledati ponovo
export const createUser = async (user: IUser): Promise<void> => {
    try {
        const userFound = await userExists(user.email);
        if (userFound)
            throw new Error("User already exists!");

        const userToAdd = { ...user, password: hashPassword(user.password) }
        const params = createSQLParameters(userToAdd);
        await command(
            `INSERT INTO 
                users ( 
                    status, 
                    name, 
                    surname, 
                    type, 
                    email, 
                    password, 
                    phone, 
                    country
                ) 
            VALUES 
                (
                    2, 
                    ?, 
                    ?, 
                    ?, 
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

export const login = async (requestData: IUserLogin): Promise<string> => {
    if (!requestData?.email || !requestData?.password) return "";

    const params = createSQLParameters({
        email: requestData.email
    });
    const data = await query(
        `SELECT 
            id,
            password,
            email
        FROM 
            users
        WHERE
            email = ?;
        `, params) as Partial<IUser>[];

    if (!data[0]?.id) return "";

    const { password, ...user } = data[0];
    const passwordsMatch: boolean = dehashPassword(requestData.password, password);

    const token = passwordsMatch == true ?
        await addLoginData(data[0].id, user.email || requestData.email) : "";

    //Dodati error handling ako je token ""
    return token;
}

export const hardDeleteUser = async (id: string): Promise<void> => {
    const params = createSQLParameters({ id });
    await query(
        `DELETE FROM 
            users 
        WHERE 
            id = ?;`,
        params);
}

export const softDeleteUser = async (id: string): Promise<void> => {
    const params = createSQLParameters({ id });
    await query(
        `UPDATE 
            users
        SET 
            isDeleted = 1
        WHERE 
            id = ?;
    `, params);
}

const userExists = async (email: string): Promise<boolean> => {
    const params = createSQLParameters({ email });
    const data = await query(
        `SELECT 
            COUNT(id) 
        AS
            count
        FROM 
            users
        WHERE
            email = ?;
        `, params) as ICount[];
    return data[0].count > 0 ? true : false;
}

const addLoginData = async (userId: string, email: string): Promise<string> => {
    const token = createToken(userId, email);
    if (!token) throw new Error("Token could not be created!");

    const params: string[][] = [
        createSQLParameters(userId),
        createSQLParameters({
            userId,
            token
        })
    ];

    const queries: string[] = [
        `DELETE FROM
            activeLogins
        WHERE
            id = '${userId}'`,
        `INSERT INTO 
            activeLogins (
                id, 
                token
            )
            VALUES 
            (
                ?, 
                ?
            );`
    ];

    await multiQuery(queries, params);

    return token;
}

