import { describe, jest } from "@jest/globals";

process.env.EMAIL_COLLECTION = "users";
process.env.ROLES_FIELD = "roles";

// Mocking different data
jest.unstable_mockModule("../../db/couchbaseDriver.js", () => ({
  BUCKET: "mockBucket",
  SCOPE: "mockScope",
  connectCouchbase: jest.fn(async () => ({
    cluster: {
      query: jest.fn(async (queryString, options) => {
        const email = options?.parameters?.email;

        if (email === "exists@test.dk") {
          return { rows: [{ roles: ["tester", "developer"] }] };
        }

        if (email === "singlerole@test.dk") {
          return { rows: [{ roles: "tester" }] };
        }

        if (email === "noroles@test.dk") {
          return { rows: [{ roles: [] }] };
        }

        if (email === "notfound@test.dk") {
          return { rows: [] };
        }

        if (email === "noindex@test.dk") {
          const err = new Error("Planning failure");
          err.cause = { first_error_code: 4000 };
          throw err;
        }

        if (email === "nokeyspace@test.dk") {
          const err = new Error("Keyspace missing");
          err.cause = { first_error_message: "Keyspace not found" };
          throw err;
        }

        throw new Error("Unknown error");
      }),
    },
  })),
}));

const { rolesCheckCB } = await import("../../checks/couchbase/rolesCheckCB.js");

describe("rolesCheckCB()", () => {
  test("returns success when user has multiple roles", async () => {
    const result = await rolesCheckCB("exists@test.dk");

    expect(result.status).toBe("success");
    expect(result.data).toEqual(["tester", "developer"]);
    expect(result.message).toBe("exists@test.dk has roles: tester, developer");
  });

  test("returns success when user has a single string role", async () => {
    const result = await rolesCheckCB("singlerole@test.dk");

    expect(result.status).toBe("success");
    expect(result.data).toEqual(["tester"]);
    expect(result.message).toBe("singlerole@test.dk has roles: tester");
  });

  test("returns fail when user has 0 roles", async () => {
    const result = await rolesCheckCB("noroles@test.dk");

    expect(result.status).toBe("fail");
    expect(result.data.length).toBe(0);
    expect(result.message).toBe("noroles@test.dk has 0 roles");
  });

  test("returns fail when user does not exist", async () => {
    const result = await rolesCheckCB("notfound@test.dk");

    expect(result.status).toBe("fail");
    expect(result.data).toEqual([]);
    expect(result.message).toBe("Email not found: notfound@test.dk");
  });

  test("returns error when index is missing", async () => {
    const result = await rolesCheckCB("noindex@test.dk");

    expect(result.status).toBe("error");
    expect(result.message).toBe("Required index is missing");
    expect(result.detail).toContain("CREATE INDEX");
  });

  test("returns error when keyspace is missing", async () => {
    const result = await rolesCheckCB("nokeyspace@test.dk");

    expect(result.status).toBe("error");
    expect(result.message).toBe("The bucket/scope/collection does not exist");
    expect(result.detail).toContain("Keyspace not found");
  });

  test("returns error for unknown errors", async () => {
    const result = await rolesCheckCB("error@test.dk");

    expect(result.status).toBe("error");
    expect(result.message).toBe("Unknown Couchbase error");
    expect(result.detail).toBe("Unknown error");
  });
});
