import { IBaseClass } from "./util/base-class";

import { ESensorType } from "../enums/sensor-type";
import { IReading } from "./reading";

export interface ISensor extends IBaseClass {
    name: string;
    manufacturer?: string;
    price?: number;
    type: ESensorType;
    serialNumber: string;
    readings: IReading[];
    high: number;
    low: number;
    deviceId?: string;
}