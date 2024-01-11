import { EUserType } from "../enums/user-type";
import { IDevice } from "./device";
import { IBaseClass } from "./util/base-class";

export interface IUser extends IBaseClass {
    name: string;
    surname: string;
    type: EUserType;
    email: string;
    password: string;
    phone: string;
    country: string;
    devices?: IDevice[];
}

export interface IUserLogin {
    email: string;
    password: string;
}

export interface ILoginResponse extends Partial<IUser> {
    token: string | null;
}