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
const sensor_1 = require("../services/sensor");
const middleware_1 = require("./middleware/middleware");
const router = express_1.default.Router();
router.get('/', [middleware_1.authenticateToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    if (!((_a = req.query) === null || _a === void 0 ? void 0 : _a.page) || !((_b = req.query) === null || _b === void 0 ? void 0 : _b.size) || !((_c = req.query) === null || _c === void 0 ? void 0 : _c.user)) {
        res.status(400).json({ message: "Bad request!" });
        return;
    }
    const requestData = {
        pageIndex: Number(req.query.page),
        pageSize: Number(req.query.size),
        filter: String(req.query.user),
    };
    const response = yield (0, sensor_1.getSensors)(requestData);
    res.status(200).json(response.data);
}));
router.get('/:id', [middleware_1.authenticateToken, middleware_1.checkIdParam], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = (yield (0, sensor_1.getSensor)(id))[0];
    res.status(200).json(result);
}));
router.post('/', /*[authenticateToken, emptyBodyCheck],*/ (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, sensor_1.addSensor)(req.body);
    res.status(200).json({ message: "Sensor added successfully!" });
}));
router.put('/:id/activate', [middleware_1.authenticateToken, middleware_1.checkIdParam], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, sensor_1.activateSensor)(req.params.id);
    res.status(200).json({ message: "Sensor successfully activated!" });
}));
router.put('/:id/deactivate', [middleware_1.authenticateToken, middleware_1.emptyBodyCheck, middleware_1.checkIdParam], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, sensor_1.deactivateSensor)(req.params.id);
    res.status(200).json({ message: "Sensor successfully deactivated!" });
}));
router.delete('/:id', [middleware_1.authenticateToken, middleware_1.checkIdParam], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, sensor_1.deleteSensor)(req.params.id);
    res.status(200).json({ message: "Sensor successfully deleted!" });
}));
exports.default = router;
