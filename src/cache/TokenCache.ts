import { ITokenCache } from './ITokenCache';
import { IAccessToken } from '../common/IAccessToken';

export class TokenCache implements ITokenCache {
    private static tokens: { [key: string]: IAccessToken } = {};

    public insert(token: IAccessToken, key: string): void {
        TokenCache.tokens[key] = token;
    }

    public remove(key: string): void {
        if (TokenCache.tokens[key]) {
            delete TokenCache.tokens[key];
        }
    }

    get(key: string): IAccessToken {
        if (TokenCache.tokens[key] && this.isAccessTokenValid(TokenCache.tokens[key])) {
            return TokenCache.tokens[key];
        }

        this.remove(key);
        return null;
    }

    public isAccessTokenValid(token: IAccessToken): boolean {
        return token && token.value && token.expireOn > new Date();
    }

}
