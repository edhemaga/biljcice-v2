"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIdParam = exports.emptyBodyCheck = exports.paginationCheck = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//JWT Authentication Tutorial - Node.js (Youtube)
const authenticateToken = (req, res, next) => {
    var _a;
    const authHeader = req.headers['authorization'];
    const token = (_a = (authHeader && authHeader.split(' ')[1])) !== null && _a !== void 0 ? _a : null;
    if (!token)
        return res.sendStatus(401);
    jsonwebtoken_1.default.verify(token, (process.env.SECRET_KEY || ''), (err, user) => {
        if (err)
            return res.sendStatus(403);
        next();
    });
};
exports.authenticateToken = authenticateToken;
const paginationCheck = (req, res, next) => {
    var _a, _b;
    if (!((_a = req.query) === null || _a === void 0 ? void 0 : _a.page) || !((_b = req.query) === null || _b === void 0 ? void 0 : _b.size))
        return res
            .status(400)
            .json({ meesage: "Bad request!" });
    next();
};
exports.paginationCheck = paginationCheck;
const emptyBodyCheck = (req, res, next) => {
    var _a;
    const emptyBody = (_a = (!req.body || Object.keys(req.body).length == 0)) !== null && _a !== void 0 ? _a : false;
    if (emptyBody)
        return res
            .status(400)
            .json({ message: "No data body provided!" });
    next();
};
exports.emptyBodyCheck = emptyBodyCheck;
const checkIdParam = (req, res, next) => {
    if (!req.params.id)
        res.status(400).json({ message: "Bad request!" });
    next();
};
exports.checkIdParam = checkIdParam;
