import { IAuthData } from './IAuthData';

export interface ISharePointProfile {
    username: string;
    displayName: string;
    email: string;
    authData: IAuthData;
}
