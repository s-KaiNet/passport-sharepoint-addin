export interface IAuthData {
    spHostUrl: string;
    spAppWebUrl?: string;
    refreshToken: string;
    realm: string;
    cacheKey: string;
    securityTokenServiceUri: string;
}
