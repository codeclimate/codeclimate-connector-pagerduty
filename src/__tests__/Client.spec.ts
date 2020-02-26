import { buildFakeManager, buildFakeLogger } from "codeclimate-collector-sdk/lib/TestHelpers"

import { Client } from "../Client"
import { StreamSyncer } from "../StreamSyncer"

jest.mock("../StreamSyncer")

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
      const client = new Client(
        new Map([
          ["api_key", "fake-key"],
        ]),
        buildFakeManager(),
        buildFakeLogger(),
      )

      const stream = null
      const cutoff = new Date()

      return client.syncStream(stream, cutoff).then(() => {
        const mock = (StreamSyncer as any).mock
        console.log((StreamSyncer as any).mock.calls)
        expect(mock.calls.length).toBe(1)
        expect(mock.calls[0]).toEqual([
          client.configuration, client.manager, client.logger, cutoff
        ])
      })
    })
  })
})
