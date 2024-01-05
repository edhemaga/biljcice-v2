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
exports.deleteDevice = exports.deactivateDevice = exports.activateDevice = exports.addDevice = exports.getDevice = exports.getDevices = void 0;
const mysql_1 = require("../assets/db/config/mysql");
const util_1 = require("./helpers/util");
const getDevices = (requestData) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = requestData.filter;
    const data = yield (0, mysql_1.query)(`SELECT
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
            ${(0, util_1.calculateOffset)(requestData)};`);
    const response = {
        message: "Data successfully fetched!",
        status: 200,
        data: data,
    };
    return response;
});
exports.getDevices = getDevices;
const getDevice = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield (0, mysql_1.query)(`SELECT
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
    return data;
});
exports.getDevice = getDevice;
const addDevice = (deviceToAdd) => __awaiter(void 0, void 0, void 0, function* () {
    const params = (0, util_1.createSQLParameters)(deviceToAdd);
    yield (0, mysql_1.command)(`INSERT INTO 
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
            );`, params);
});
exports.addDevice = addDevice;
const activateDevice = (deviceId) => __awaiter(void 0, void 0, void 0, function* () {
    const params = (0, util_1.createSQLParameters)(deviceId);
    yield (0, mysql_1.command)(`UPDATE 
            devices
        SET 
            status = 1 
        WHERE 
            id = ?;`, params);
});
exports.activateDevice = activateDevice;
const deactivateDevice = (deviceId) => __awaiter(void 0, void 0, void 0, function* () {
    const params = (0, util_1.createSQLParameters)(deviceId);
    yield (0, mysql_1.command)(`UPDATE 
            devices
        SET 
            status = 2 
        WHERE 
            id = ?;`, params);
});
exports.deactivateDevice = deactivateDevice;
const deleteDevice = (deviceId) => __awaiter(void 0, void 0, void 0, function* () {
    const params = (0, util_1.createSQLParameters)(deviceId);
    yield (0, mysql_1.command)(`UPDATE 
            devices
        SET 
            isDeleted = TRUE 
        WHERE 
            id = ?;`, params);
});
exports.deleteDevice = deleteDevice;
