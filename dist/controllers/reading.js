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
const middleware_1 = require("./middleware/middleware");
const reading_1 = require("../services/reading");
const router = express_1.default.Router();
router.get('/:deviceId', /*[authenticateToken],*/ (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params.deviceId) {
        res.status(400);
        return;
    }
    const data = yield (0, reading_1.getReadings)(req.query.deviceId);
    res.status(200).send(data);
}));
router.get('/:deviceId/day', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params.deviceId) {
        res.status(400);
        return;
    }
    const data = yield (0, reading_1.getReadingsLastDay)(req.params.deviceId);
    res.status(200).send(data);
}));
router.post('/', [/*authenticateToken,*/ middleware_1.emptyBodyCheck], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, reading_1.postReading)(req.body);
    res.status(200).send("Reading successfully added!");
}));
router.post('/sync', [/*authenticateToken,*/ middleware_1.emptyBodyCheck], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, reading_1.syncReadings)(req.body);
    res.status(200).send("Reading successfully added!");
}));
exports.default = router;
