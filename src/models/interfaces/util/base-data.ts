export interface IBaseRequest {
    id?: string;
    pageIndex: number | 0;
    pageSize: number | 10;
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