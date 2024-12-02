
export interface IUser {
    id: number;
    name: string;
    surname: string;
    login: string;
    password: string;
    expires?: number; 
}

export type InputUser = Omit<IUser, 'id' | 'expires'>; 

export interface ISession {
    id: string;
    user_id: number;
    expires: number;
}
