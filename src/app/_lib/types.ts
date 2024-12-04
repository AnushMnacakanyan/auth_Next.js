
export interface IUser {
    id: number;
    name: string;
    surname: string;
    login: string;
    password: string;
    expires?: number;
    attempts: number
    time?: number
}

export type InputUser = Omit<IUser, 'id' | 'expires' | "attempts" | "time">;

export interface ISession {
    id: string;
    user_id: number;
    expires: number;
}
