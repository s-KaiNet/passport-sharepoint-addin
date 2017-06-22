import { IAuthData } from './IAuthData';

export interface ISharePointProfile {
    loginName: string;
    displayName: string;
    email: string;
    authData: IAuthData;
}
