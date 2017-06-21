import { parse as urlparse } from 'url';
import * as request from 'request-promise';
import * as Promise from 'bluebird';

import { Consts } from './Consts';
import { IOAuthConfig } from '../common/IOAuthConfig';
import { IAccessToken } from '../common/IAccessToken';
import { IAuthData } from '../strategy/IAuthData';

export class TokenHelper {
    public static getUserAccessToken(authData: IAuthData, oauth: IOAuthConfig, url: string): Promise<IAccessToken> {
        const spAuthority = urlparse(url).host;
        const resource = `${Consts.SharePointPrincipal}/${spAuthority}@${authData.realm}`;
        const appId = `${oauth.clientId}@${authData.realm}`;
        const tokenService = urlparse(authData.securityTokenServiceUri);
        const tokenUrl = `${tokenService.protocol}//${tokenService.host}/${authData.realm}${tokenService.path}`;

        return request.post(tokenUrl, {
            form: {
                grant_type: 'refresh_token',
                client_id: appId,
                client_secret: oauth.clientSecret,
                refresh_token: authData.refreshToken,
                resource: resource
            },
            json: true
        })
            .then(data => {
                return {
                    value: data.access_token,
                    expireOn: new Date(parseInt(data.expires_on, 10))
                } as IAccessToken
            });
    }

    public static getAppOnlyAccessToken(authData: IAuthData, oauth: IOAuthConfig, url: string): Promise<IAccessToken> {
        const spAuthority = urlparse(url).host;
        const resource = `${Consts.SharePointPrincipal}/${spAuthority}@${authData.realm}`;
        const appId = `${oauth.clientId}@${authData.realm}`;
        const tokenService = urlparse(authData.securityTokenServiceUri);
        const tokenUrl = `${tokenService.protocol}//${tokenService.host}/${authData.realm}${tokenService.path}`;

        return request.post(tokenUrl, {
            form: {
                grant_type: 'client_credentials',
                client_id: appId,
                client_secret: oauth.clientSecret,
                scope: resource,
                resource: resource
            },
            json: true
        })
            .then(data => {
                return {
                    value: data.access_token,
                    expireOn: new Date(parseInt(data.expires_on, 10))
                } as IAccessToken
            });
    }
}
