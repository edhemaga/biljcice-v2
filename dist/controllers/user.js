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
const express_1 = __importDefault(require("express"));
const user_1 = require("../services/user");
const middleware_1 = require("./middleware/middleware");
const router = express_1.default.Router();
router.get('/', [middleware_1.authenticateToken, middleware_1.paginationCheck], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requestData = {
        pageIndex: Number(req.query.page),
        pageSize: Number(req.query.size)
    };
    const users = yield (0, user_1.getAllUsers)(requestData);
    res.json(users);
}));
router.post('/', [middleware_1.emptyBodyCheck], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, user_1.createUser)(req.body);
        res.status(200);
    }
    catch (error) {
        res.status(400).json(JSON.stringify(error));
    }
}));
router.post('/login', [middleware_1.emptyBodyCheck], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = yield (0, user_1.login)(req.body);
    res.status(200).json({ token });
}));
router.delete('/delete/:id', [middleware_1.authenticateToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.query.id;
    if (!id)
        res.status(400).json({ message: "User not provided!" });
}));
exports.default = router;
