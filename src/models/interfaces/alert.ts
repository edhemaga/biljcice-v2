import { IBaseClass } from "./util/base-class";

import { ESeverity } from "../enums/severity";

export interface IAlert extends IBaseClass {
    severity: ESeverity;
    notified: boolean;
}