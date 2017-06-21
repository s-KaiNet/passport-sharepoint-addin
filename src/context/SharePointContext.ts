import { parse as urlparse } from 'url';
import * as Promise from 'bluebird';
import { ITokenCache } from '../cache/ITokenCache';
import { TokenCache } from '../cache/TokenCache';
import { IAuthData } from '../strategy/IAuthData';
import { IAccessToken } from '../common/IAccessToken';
import { IOAuthConfig } from '../common/IOAuthConfig';

export abstract class SharePointContext {
    public static TokenCache: ITokenCache = new TokenCache();

    protected constructor(protected authData: IAuthData, protected oauth: IOAuthConfig) {
    }

    public getUserAccessTokenForSPHost(): Promise<string> {
        return this.getUserAccessToken(this.authData.spHostUrl);
    }

    public getUserAccessTokenForSPAppWeeb(): Promise<string> {
        return this.getUserAccessToken(this.authData.spAppWebUrl);
    }

    public getAppOnlyAccessTokenForSPHost(): Promise<string> {
        return this.getUserAccessToken(this.authData.spHostUrl);
    }

    public getAppOnlyAccessTokenForSPAppWeeb(): Promise<string> {
        return this.getUserAccessToken(this.authData.spAppWebUrl);
    }

    protected getUserAccessToken(url: string): Promise<string> {
        const accessToken = SharePointContext.TokenCache.get(this.getUserCacheKey(url));

        if (!accessToken) {
            return this.createUserAccessToken(url)
                .then(accessToken => {
                    SharePointContext.TokenCache.insert(accessToken, this.getUserCacheKey(url));
                    return accessToken.value;
                });
        }

        return Promise.resolve(accessToken.value);
    }

    protected getAppOnlyAccessToken(url: string): Promise<string> {
        const accessToken = SharePointContext.TokenCache.get(this.getAppOnlyCacheKey(url));

        if (!accessToken) {
            return this.createAppOnlyAccessToken(url)
                .then(accessToken => {
                    SharePointContext.TokenCache.insert(accessToken, this.getAppOnlyCacheKey(url));
                    return accessToken.value;
                });
        }

        return Promise.resolve(accessToken.value);
    }

    protected getUserCacheKey(url: string): string {
        return `${this.authData.cacheKey}_${urlparse(url).host}`;
    }

    protected getAppOnlyCacheKey(url: string): string {
        return `${this.authData.realm}_${urlparse(url).host}`;
    }

    protected abstract createUserAccessToken(url: string): Promise<IAccessToken>;
    protected abstract createAppOnlyAccessToken(url: string): Promise<IAccessToken>;
}
