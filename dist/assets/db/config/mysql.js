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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multiQuery = exports.command = exports.query = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const access = {
    user: "root",
    password: "admin",
    localAddress: "localhost",
    port: 3306,
    database: "biljcice"
};
const connect = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield promise_1.default.createConnection(access);
});
//Mediator pattern reference
const query = (query, params) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conn = yield connect();
        var result = (yield conn.query(query, params || []))[0];
        return result;
    }
    catch (error) {
        throw new Error(JSON.stringify(error));
    }
});
exports.query = query;
const command = (query, params) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conn = yield connect();
        yield Promise.all([
            conn.beginTransaction(),
            conn.execute(query, params || []),
            conn.commit()
        ]);
    }
    catch (error) {
        throw new Error(JSON.stringify(error));
    }
});
exports.command = command;
const multiQuery = (queries, params) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conn = yield connect();
        yield Promise.all([
            conn.beginTransaction(),
            queries.forEach((query, indx) => {
                conn.execute(query, params[indx] || []);
            }),
            conn.commit()
        ]);
    }
    catch (error) {
        throw new Error(JSON.stringify(error));
    }
});
exports.multiQuery = multiQuery;
