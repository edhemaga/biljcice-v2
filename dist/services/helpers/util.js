"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareBulkInsertQuery = exports.createToken = exports.calculateOffset = exports.dehashPassword = exports.hashPassword = exports.createSQLParameters = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//Extract this to env vars
const createSQLParameters = (object) => {
    if (!object)
        return [];
    return Object
        .entries(object)
        .map(property => {
        return String(property[1]);
    });
};
exports.createSQLParameters = createSQLParameters;
const hashPassword = (password) => {
    return bcrypt_1.default.hashSync(password, (process.env.SALT_R || 10));
};
exports.hashPassword = hashPassword;
const dehashPassword = (password, hashed) => {
    if (!hashed)
        return false;
    return bcrypt_1.default.compareSync(password, hashed);
};
exports.dehashPassword = dehashPassword;
const calculateOffset = (requestData) => {
    return requestData.pageSize * requestData.pageIndex;
};
exports.calculateOffset = calculateOffset;
const createToken = (id, email) => {
    const token = jsonwebtoken_1.default.sign({ id, name: email }, process.env.SECRET_KEY || '', {
        expiresIn: '2 days',
    });
    return token;
};
exports.createToken = createToken;
const prepareBulkInsertQuery = (query, data) => {
    let params = [];
    data.forEach(reading => {
        params = [...params, (0, exports.createSQLParameters)(reading)];
    });
    let queries = [];
    for (let i = 0; i < params.length; i++) {
        queries = [...queries, query];
    }
    return { queries, params };
};
exports.prepareBulkInsertQuery = prepareBulkInsertQuery;
