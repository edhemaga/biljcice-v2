"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.softDeleteUser = exports.hardDeleteUser = exports.login = exports.createUser = exports.getUser = exports.getAllUsers = void 0;
const mysql_1 = require("../assets/db/config/mysql");
const util_1 = require("./helpers/util");
//Pagination will be included in order not to overstrech SELECT 
const getAllUsers = (requestData) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield (0, mysql_1.query)(`SELECT
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
            ${(0, util_1.calculateOffset)(requestData)};`);
    if (!data)
        return [];
    return data;
});
exports.getAllUsers = getAllUsers;
const getUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id)
        return null;
    const data = yield (0, mysql_1.query)(`SELECT * 
        FROM 
            users 
        WHERE 
            id = ${id};`);
    if (!data)
        return null;
    return data[0];
});
exports.getUser = getUser;
const createUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userFound = yield userExists(user.email);
        if (userFound)
            throw new Error("User already exists!");
        const userToAdd = Object.assign({}, user /*,hashPassword(user.password)*/);
        const params = (0, util_1.createSQLParameters)(userToAdd);
        yield (0, mysql_1.command)(`INSERT INTO 
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
                );`, params);
    }
    catch (error) {
        throw new Error(JSON.stringify(error));
    }
});
exports.createUser = createUser;
const login = (user) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!(user === null || user === void 0 ? void 0 : user.email) || !(user === null || user === void 0 ? void 0 : user.password))
        return null;
    const params = (0, util_1.createSQLParameters)({
        email: user.email
    });
    const data = yield (0, mysql_1.query)(`SELECT 
            id,
            password
        FROM 
            users
        WHERE
            email = ?;
        `, params);
    if (!((_a = data[0]) === null || _a === void 0 ? void 0 : _a.id))
        return null;
    const token = (0, util_1.dehashPassword)(user.password, data[0].password) == true ?
        addLoginData(data[0].id, user.email) : null;
    return token;
});
exports.login = login;
const hardDeleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const params = (0, util_1.createSQLParameters)({ id });
    yield (0, mysql_1.query)(`DELETE FROM 
            users 
        WHERE 
            id = ?;`, params);
});
exports.hardDeleteUser = hardDeleteUser;
const softDeleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const params = (0, util_1.createSQLParameters)({ id });
    yield (0, mysql_1.query)(`UPDATE 
            users
        SET 
            isDeleted = 1
        WHERE 
            id = ?;
    `, params);
});
exports.softDeleteUser = softDeleteUser;
const userExists = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const params = (0, util_1.createSQLParameters)({ email });
    const data = yield (0, mysql_1.query)(`SELECT 
            COUNT(id) 
        AS
            count
        FROM 
            users
        WHERE
            email = ?;
        `, params);
    return data[0].count > 0 ? true : false;
});
const addLoginData = (userId, email) => __awaiter(void 0, void 0, void 0, function* () {
    const token = (0, util_1.createToken)(userId, email);
    if (!token)
        throw new Error("Token could not be created!");
    const params = [
        (0, util_1.createSQLParameters)(userId),
        (0, util_1.createSQLParameters)({
            userId,
            token
        })
    ];
    const queries = [
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
    yield (0, mysql_1.multiQuery)(queries, params);
    return token;
});
