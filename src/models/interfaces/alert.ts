import { IBaseClass } from "./util/base-class";

import { ESeverity } from "../enums/severity";
import { ESensorType } from "../enums/sensor-type";

export interface IAlert extends IBaseClass {
    severity: ESeverity;
    notified: boolean;
}

export interface IAlertExtended extends IAlert {
    high: number;
    low: number;
    name: string;
    type: ESensorType;
}
