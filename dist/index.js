"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = require("path");
const dotenv_1 = __importDefault(require("dotenv"));
const bodyParser = __importStar(require("body-parser"));
const user_1 = __importDefault(require("./controllers/user"));
const device_1 = __importDefault(require("./controllers/device"));
const sensor_1 = __importDefault(require("./controllers/sensor"));
const reading_1 = __importDefault(require("./controllers/reading"));
const cors_2 = require("./assets/cors");
const app = (0, express_1.default)();
app.use(bodyParser.urlencoded({ 'extended': true }));
app.use(bodyParser.json());
//Ovo radi, resolve sa pathom je potreban u TS-u
dotenv_1.default.config({ path: (0, path_1.resolve)(__dirname, ".env") });
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)(cors_2.options));
app.use(express_1.default.json());
app.use("/user", user_1.default);
app.use("/device", device_1.default);
app.use("/sensor", sensor_1.default);
app.use("/reading", reading_1.default);
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
