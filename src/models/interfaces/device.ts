import { IBaseClass } from "./util/base-class";

import { EStatus } from "../enums/status";

import { IConfiguration } from "./configuration";
import { ISensor } from "./sensor";

export interface IDevice extends IBaseClass {
    geoLocation: string;
    activatedOn: Date;
    sensors?: ISensor[];
    configurations?: IConfiguration[];
}

export interface IDeviceDTO {
    geoLocation: string;
    userId: string;
}