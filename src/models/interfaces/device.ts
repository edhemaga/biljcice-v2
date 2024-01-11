import { IBaseClass } from "./util/base-class";

import { ISensor } from "./sensor";

export interface IDevice extends IBaseClass {
    geoLocation: string;
    //Možda ukloniti poslije, da li ima potrebe kad već imamo updatedOn
    activatedOn?: Date;
    sensors?: ISensor[];
}

export interface IDeviceDTO {
    geoLocation: string;
    userId: string;
}