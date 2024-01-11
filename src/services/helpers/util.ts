import bcrypt from "bcrypt";
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';

import { IBaseRequest } from "../../models/interfaces/util/base-data";
import { IBulkInsert } from "../../models/interfaces/util/queries-helper";

//Extract this to env vars

export const createSQLParameters = (object: unknown): string[] => {
    if (!object) return [];
    return Object
        .entries(object)
        .map(property => {
            return String(property[1]);
        })
}

export const hashPassword = (password: string): string => {
    //SALT_ROUNDS se MORA pretvoriti u broj
    return bcrypt.hashSync(password, Number(process.env.SALT_ROUNDS));
}

export const dehashPassword = (password: string, hashed?: string): boolean => {
    if (!hashed) return false;
    return bcrypt.compareSync(password, hashed);
}

export const calculateOffset = (requestData: IBaseRequest): number => {
    return requestData.pageSize * requestData.pageIndex;
}

export const createToken = (id: string, email: string): string => {
    const token = jwt.sign(
        {
            id,
            email
        },
        process.env.SECRET_KEY || '',
        {
            expiresIn: '7 days',
        },
    );
    return token;
}

export const prepareBulkInsertQuery = (query: string, data: unknown[]): IBulkInsert => {

    let params: string[][] = [];

    data.forEach(reading => {
        params = [...params, createSQLParameters(reading)];
    });

    let queries: string[] = [];
    for (let i = 0; i < params.length; i++) {
        queries = [...queries, query];
    }
    return { queries, params };
}