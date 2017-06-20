import { IAuthData } from '../strategy/IAuthData';
import { IOAuthConfig } from '../common/IOAuthConfig';
import { SharePointContext } from './SharePointContext';
import { AcsContext } from './AcsContext';

export class SPContextProvider {
    public static get(authData: IAuthData, oauth: IOAuthConfig): SharePointContext {
        return new AcsContext(authData, oauth);
    }
}
