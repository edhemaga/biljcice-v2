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
exports.syncReadings = exports.postReading = exports.getReadingsLastDay = exports.getReadingsByTimeInterval = exports.getReadings = void 0;
const mysql_1 = require("../assets/db/config/mysql");
const util_1 = require("./helpers/util");
const getReadings = (deviceId) => __awaiter(void 0, void 0, void 0, function* () {
    const params = (0, util_1.createSQLParameters)({ deviceId });
    const data = yield (0, mysql_1.query)(`SELECT 
            * 
        FROM
            readings
        INNER JOIN
            sensors
        ON 
            readings.sensorId = sensors.id
        WHERE 
            sensors.id = ?;`, params);
    return data;
});
exports.getReadings = getReadings;
const getReadingsByTimeInterval = (deviceId) => __awaiter(void 0, void 0, void 0, function* () {
});
exports.getReadingsByTimeInterval = getReadingsByTimeInterval;
const getReadingsLastDay = (deviceId) => __awaiter(void 0, void 0, void 0, function* () {
    const params = (0, util_1.createSQLParameters)({ deviceId });
    const data = yield (0, mysql_1.query)(`SELECT
            HOUR(createdOn) AS time,
            sensorId AS sensor,
            SUM(value) AS value,
            high, low
        FROM 
            readings
        WHERE
            createdOn > DATE_SUB(NOW(), INTERVAL 24 HOUR)
        GROUP BY 
            minute(createdOn),
            sensorId,
            high,
            low;`, params);
    return data;
});
exports.getReadingsLastDay = getReadingsLastDay;
const postReading = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Demo, izbrisati poslije
        if (data && data.value) {
            data.value += Math.random() || 10;
            data.value = Math.round(data.value * 10000) / 10000;
        }
        const params = (0, util_1.createSQLParameters)(data);
        yield (0, mysql_1.command)(`INSERT INTO
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
                );`, params);
    }
    catch (error) {
        throw new Error(JSON.stringify(error));
    }
});
exports.postReading = postReading;
const syncReadings = (data) => __awaiter(void 0, void 0, void 0, function* () {
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
        const { queries, params } = (0, util_1.prepareBulkInsertQuery)(query, data || {});
        yield (0, mysql_1.multiQuery)(queries, params);
    }
    catch (error) {
        throw new Error(JSON.stringify(error));
    }
});
exports.syncReadings = syncReadings;
