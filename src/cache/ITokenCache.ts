import { IAccessToken } from '../common/IAccessToken';

export interface ITokenCache {
    insert(token: IAccessToken, key: string): void;
    remove(key: string): void;
    get(key: string): IAccessToken;
    isAccessTokenValid(token: IAccessToken): boolean;
}
