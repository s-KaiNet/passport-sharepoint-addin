import { SharePointContext } from './SharePointContext';
import { IAuthData } from '../strategy/IAuthData';
import { IAccessToken } from '../common/IAccessToken';
import { TokenHelper } from '../utils/TokenHelper';
import * as Promise from 'bluebird';
import { IOAuthConfig } from '../common/IOAuthConfig';

export class AcsContext extends SharePointContext {
    constructor(authData: IAuthData, oauth: IOAuthConfig) {
        super(authData, oauth);
    }

    protected createUserAccessToken(url: string): Promise<IAccessToken> {
        return TokenHelper.getUserAccessToken(this.authData, this.oauth, url);
    }

    protected createAppOnlyAccessToken(url: string): Promise<IAccessToken> {
        return TokenHelper.getAppOnlyAccessToken(this.authData, this.oauth, url);
    }
}
