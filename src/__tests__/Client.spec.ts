import { buildFakeManager, buildFakeLogger } from "codeclimate-collector-sdk/lib/TestHelpers"

import { Client } from "../Client"

describe(Client, () => {
  describe("verifyConfiguration", () => {
    test("says valid config is valid", () => {
      const client = new Client(
        new Map([
          ["api_key", "fake-key"],
        ]),
        buildFakeManager(),
        buildFakeLogger(),
      )

      return client.verifyConfiguration().then((result) => {
        expect(result.isValid).toBe(true)
      })
    })

    test.skip("says config missing api key is invalid", () => {
      const client = new Client(
        new Map(),
        buildFakeManager(),
        buildFakeLogger(),
      )

      return client.verifyConfiguration().then((result) => {
        expect(result.isValid).toBe(false)
        expect(result.errorMessages).toBeDefined()
        expect(result.errorMessages!.length).toBe(1)
      })
    })
  })

  describe("syncStream", () => {
    test("it calls the syncer", () => {
    })
  })
})
