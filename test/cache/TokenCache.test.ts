import { expect } from 'chai';

import { TokenCache } from '../../src/cache';
import { IAccessToken } from '../../src/common/IAccessToken';

describe('TokenCache', () => {
    const date = new Date();
    date.setHours(date.getHours() + 1)
    const token: IAccessToken = {
        value: 'test',
        expireOn: date
    };

    it('should insert a new token', () => {
        const cache = new TokenCache();
        cache.insert(token, 'key');
        expect(cache.get('key')).is.equal(token);
    });

    it('should remove a token', () => {
        const cache = new TokenCache();
        cache.insert(token, 'key');
        expect(cache.get('key')).is.equal(token);
        cache.remove('key');
        expect(cache.get('key')).is.equal(null);
    });

    it('should return null if key doesn\'t exists', () => {
        const cache = new TokenCache();
        date.setHours(date.getHours() - 1);
        cache.insert(token, 'key');
        expect(cache.get('key')).is.equal(null);
    });

    it('should return null if token is invalid', () => {
        const cache = new TokenCache();
        cache.insert(token, 'key');
        expect(cache.get('empty')).is.equal(null);
    });
});
