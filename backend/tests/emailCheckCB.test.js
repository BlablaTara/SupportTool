import { describe, expect, jest } from '@jest/globals';

//Mocking coucbase-driver before importing emailCheckCB
jest.unstable_mockModule('../db/couchbase/couchbaseDriver.js', () => ({
    BUCKET:'mockBucket',
    SCOPE: 'mockScope',
    connectCouchbase: jest.fn(async () => ({
        cluster: {
            query: jest.fn( async (queryString, options) => {
                const email = options?.parameters?.email ?? null;
                
                if (email === 'exists@test.dk') {
                    return { rows: [{ users: { email } }] };
                }

                if (email === 'notfound@test.dk') {
                    return { rows:[] };
                } 

                if (email === 'noindex@test.dk') {
                    const err = new Error('Planning failure');
                    err.cause = { first_error_code: 4000 };
                    throw err;
                } 
                
                if (email === 'nokeyspace@test.dk') {
                    const err = new Error('Keyspace not found');
                    err.cause = { first_error_message: 'Keyspace not found' };
                    throw err;
                } 
                
                const err = new Error('Unknown error');
                throw err;

            })
        }
    }))
}));

const { emailCheckCB } = await import ('../db/couchbase/emailCheckCB.js');

describe('emailCheckCB()', () => {
    test('returns success when email exists', async () => {
        const result = await emailCheckCB('users', 'exists@test.dk');
        expect(result.status).toBe('success');
        expect(result.data.length).toBe(1);
        expect(result.message).toBe('User found: exists@test.dk');
    });

    test('returns fail when email does not exist', async () => {
        const result = await emailCheckCB('users', 'notfound@test.dk');
        expect(result.status).toBe('fail');
        expect(result.data.length).toBe(0);
        expect(result.message).toBe('User does not exist');
    });

    test('returns error for missing index', async () => {
        const result = await emailCheckCB('users', 'noindex@test.dk');
        expect(result.status).toBe('error');
        expect(result.message).toBe('Required index is missing');
        expect(result.detail).toContain('CREATE INDEX idx_email');
    });

    test('returns error for keyspace not found', async () => {
        const result = await emailCheckCB('users', 'nokeyspace@test.dk');
        expect(result.status).toBe('error');
        expect(result.message).toBe('The bucket/scope/collection does not exist');
        expect(result.detail).toContain('Keyspace not found');
    });

    test('returns error for unknown errors', async () => {
        const result = await emailCheckCB('users', 'error@test.dk');
        expect(result.status).toBe('error');
        expect(result.message).toBe('Unknown Couchbase error');
        expect(result.detail).toBe('Unknown error');
    });

});