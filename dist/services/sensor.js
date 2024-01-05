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
exports.deleteSensor = exports.deactivateSensor = exports.activateSensor = exports.addSensor = exports.getSensor = exports.getSensors = void 0;
const mysql_1 = require("../assets/db/config/mysql");
const util_1 = require("./helpers/util");
const getSensors = (requestData) => __awaiter(void 0, void 0, void 0, function* () {
    const deviceId = requestData.filter;
    const data = yield (0, mysql_1.query)(`SELECT
            id,
            status,
            createdOn,
            updatedOn,
            name,
            manufacturer,
            price,
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
            ${(0, util_1.calculateOffset)(requestData)};`);
    const response = {
        message: "Data successfully fetched!",
        status: 200,
        data: data,
    };
    return response;
});
exports.getSensors = getSensors;
const getSensor = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield (0, mysql_1.query)(`SELECT
            id,
            status,
            createdOn,
            updatedOn,
            name,
            manufacturer,
            price,
            type,
            serialNumber
        FROM 
            sensors
        WHERE
            isDeleted = FALSE
        AND
            id = '${id}';`);
    return data;
});
exports.getSensor = getSensor;
const addSensor = (sensorToAdd) => __awaiter(void 0, void 0, void 0, function* () {
    const params = (0, util_1.createSQLParameters)(sensorToAdd);
    yield (0, mysql_1.command)(`INSERT INTO 
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
            );`, params);
});
exports.addSensor = addSensor;
const activateSensor = (sensorId) => __awaiter(void 0, void 0, void 0, function* () {
    const params = (0, util_1.createSQLParameters)(sensorId);
    yield (0, mysql_1.command)(`UPDATE 
            sensors
        SET 
            status = 1 
        WHERE 
            id = ?;`, params);
});
exports.activateSensor = activateSensor;
const deactivateSensor = (sensorId) => __awaiter(void 0, void 0, void 0, function* () {
    const params = (0, util_1.createSQLParameters)(sensorId);
    yield (0, mysql_1.command)(`UPDATE 
            sensors
        SET 
            status = 2 
        WHERE 
            id = ?;`, params);
});
exports.deactivateSensor = deactivateSensor;
const deleteSensor = (sensorId) => __awaiter(void 0, void 0, void 0, function* () {
    const params = (0, util_1.createSQLParameters)(sensorId);
    yield (0, mysql_1.command)(`UPDATE 
            sensors
        SET 
            isDeleted = TRUE 
        WHERE 
            id = ?;`, params);
});
exports.deleteSensor = deleteSensor;
