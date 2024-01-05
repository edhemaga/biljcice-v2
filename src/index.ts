import express, { Request, Response } from 'express';

import cors from 'cors';

import { resolve } from 'path';
import dotenv from 'dotenv';

import * as bodyParser from "body-parser";

import userRoutes from "./controllers/user"
import deviceRoutes from "./controllers/device";
import sensorRoutes from "./controllers/sensor";
import readingRoutes from "./controllers/reading";
import { options } from './assets/cors';


const app = express();

app.use(bodyParser.urlencoded({ 'extended': true }));
app.use(bodyParser.json());

//Ovo radi, resolve sa pathom je potreban u TS-u
dotenv.config({ path: resolve(__dirname, ".env") });


const port = process.env.PORT || 3000;

app.use(cors(options));

app.use(express.json());

app.use("/user", userRoutes);
app.use("/device", deviceRoutes);
app.use("/sensor", sensorRoutes);
app.use("/reading", readingRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});