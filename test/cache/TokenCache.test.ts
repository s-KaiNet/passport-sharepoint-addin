import { expect } from 'chai';

import { TokenCache } from '../../src/cache';

describe('TokenCache', () => {
    it('should work', () => {
        const cache = new TokenCache();
        expect(!!cache).to.equal(true);
    })
});
