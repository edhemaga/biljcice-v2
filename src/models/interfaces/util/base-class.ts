import { EStatus } from "../../enums/status";

export interface IBaseClass {
    id: string;
    status: EStatus;
    isDeleted: boolean;
    createdOn: Date;
    updatedOn?: Date;
}