let emailCheckCB;

beforeAll(async () => {
    process.env.DB_TYPE = "Couchbase";

    jest.mock("../db/couchbase/couchbaseDriver.js", () => ({
        BUCKET: "mockBucket",
        SCOPE: "mockScope",
        connectCouchbase: jest.fn(async () => ({
            cluster: {
                query: jest.fn(({ parameters }) => {
                    if (parameters.email === "exists@test.dk") {
                        return { rows: [{ users: { email: "exists@test.dk"} }] };

                    } else if (parameters.email === "fail@test.com") {
                        return { rows: [] };
                    } else {
                        throw { cause: { first_error_code: 4000} };
                    }
                })
            }
        }))
    }));
    ({ emailCheckCB } = await import("../db/couchbase/emailCheckCB.js"));
});