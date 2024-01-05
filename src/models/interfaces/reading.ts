import { IBaseClass } from "./util/base-class";

export interface IReading extends IBaseClass {
    value: number;
    sensorId?: string;
    high: number;
    low: number;
}