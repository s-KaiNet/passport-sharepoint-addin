import * as passport from 'passport-strategy';
import { AuthenticateOptions } from 'passport';
import { parse as urlparse } from 'url';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';
import * as request from 'request-promise';
import * as Promise from 'bluebird';
import { ISharePointProfile } from './ISharePointProfile';
import { IAppToken } from './IAppToken';
import { IOAuthConfig } from '../common/IOAuthConfig';
import { Consts } from '../utils/Consts';
import { TokenHelper } from '../utils/TokenHelper';
import { IAccessToken } from '../common/IAccessToken';
import { IAuthData } from './IAuthData';

export class SharePointAddinStrategy extends passport.Strategy {

    public name: string;
    private oauth: IOAuthConfig;
    private callbackUrl: string;
    private verify: any;

    constructor(options: IOAuthConfig, callbackUrl: string, verify: any) {
        super();

        this.name = 'sharepoint';
        this.oauth = options;
        this.callbackUrl = callbackUrl;
        this.verify = verify;
    }

    public authenticate(req: Request, options: AuthenticateOptions): void {
        let path: string = urlparse(this.callbackUrl).path;
        if (req.url.indexOf(path) !== -1) {
            return this.onReturnCallback(req, options);
        }

        let hostUrl = this.ensureTrailingSlash(req.query[Consts.SPHostUrl]);
        let returnUrl = this.callbackUrl + '?{StandardTokens}';
        let encodedReturnUrl = encodeURIComponent(returnUrl);
        let postRedirectUrl: string = `${hostUrl}_layouts/15/AppRedirect.aspx?client_id=${this.oauth.clientId}&redirect_uri=${encodedReturnUrl}`;

        this.redirect(postRedirectUrl);
    }

    private onReturnCallback(req: Request, options: AuthenticateOptions): void {
        let spAppToken = req.body[Consts.SPAppToken];
        if (!spAppToken) {
            throw new Error('Unable to find SPAppToken');
        }

        let token = this.verifyAppToken(req, spAppToken);
        let hostUrl = this.ensureTrailingSlash(req.query[Consts.SPHostUrl]);
        let appWebUrl = req.query[Consts.SPAppWebUrl] ? this.ensureTrailingSlash(req.query[Consts.SPAppWebUrl]) : null;
        let authData: IAuthData = {
            spHostUrl: hostUrl,
            spAppWebUrl: appWebUrl,
            realm: token.realm,
            cacheKey: token.context.CacheKey,
            refreshToken: token.refreshtoken,
            securityTokenServiceUri: token.context.SecurityTokenServiceUri
        };

        this.getAccessToken(authData, req)
            .then(accessToken => {
                let headers = {
                    'Accept': 'application/json;odata=verbose',
                    'Authorization': 'Bearer ' + accessToken.value
                };
                return request.get(`${hostUrl}_api/web/currentuser`, {
                    json: true,
                    headers: headers
                });
            })
            .then(data => {
                let profile: ISharePointProfile = {
                    username: data.d.LoginName,
                    displayName: data.d.Title,
                    email: data.d.Email,
                    authData: authData
                };

                return this.verify(profile);
            })
            .then((spuser: any) => {
                this.success(spuser, null);
            });
    }

    private getAccessToken(authData: IAuthData, req: Request): Promise<IAccessToken> {
        let hostUrl = this.ensureTrailingSlash(req.query[Consts.SPHostUrl]);
        if (!hostUrl) {
            throw new Error('Unable to find SPHostUrl in query string');
        }

        return TokenHelper.getUserAccessToken(authData, this.oauth, authData.spHostUrl);
    }

    private verifyAppToken(req: Request, spAppToken: any): IAppToken {
        let secret = Buffer.from(this.oauth.clientSecret, 'base64');
        let token = jwt.verify(spAppToken, secret) as IAppToken;
        let audience = req.get('host');
        let realm = token.iss.substring(token.iss.indexOf('@') + 1);
        let validAudience = `${this.oauth.clientId}/${audience}@${realm}`;

        if (validAudience !== token.aud) {
            throw new Error('SP app token validation failed: invalid audience');
        }

        token.realm = realm;
        token.context = JSON.parse(token.appctx);
        return token;
    }

    private ensureTrailingSlash(url: string): string {
        if (!url.endsWith('/')) {
            return url + '/';
        }

        return url;
    }
}
