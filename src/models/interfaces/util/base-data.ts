export interface IBaseRequest {
    id?: string;
    pageIndex: number;
    pageSize: number;
    filter?: string;
}

export interface IBaseResponse<T> {
    message?: string;
    status?: number;
    data: T;
}

export interface ICount {
    count: number;
}

export interface IPassword {
    password: string;
}