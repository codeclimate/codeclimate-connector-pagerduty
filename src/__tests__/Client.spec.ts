import { buildFakeManager, buildFakeLogger } from "codeclimate-collector-sdk/lib/TestHelpers"

import { Client } from "../Client"
import { StreamSyncer } from "../StreamSyncer"
import { ConfigurationVerifier } from "../ConfigurationVerifier"

jest.mock("../StreamSyncer")
jest.mock("../ConfigurationVerifier")

describe(Client, () => {
  function buildClient(): Client {
    return new Client(
      new Map([
        ["api_token", "fake-key"],
      ]),
      buildFakeManager(),
      buildFakeLogger(),
    )
  }

  describe("verifyConfiguration", () => {
    test("it calls the verifier", () => {
      const client = buildClient()

      return client.verifyConfiguration().then(() => {
        const mock = (ConfigurationVerifier as any).mock
        expect(mock.calls.length).toBe(1)
        expect(mock.calls[0]).toEqual([
          client.configuration, client.logger
        ])
      })
    })
  })

  describe("syncStream", () => {
    test("it calls the syncer", () => {
      const client = buildClient()

      const stream = null
      const cutoff = new Date()

      return client.syncStream(stream, cutoff).then(() => {
        const mock = (StreamSyncer as any).mock
        expect(mock.calls.length).toBe(1)
        expect(mock.calls[0]).toEqual([
          client.configuration, client.manager, client.logger, cutoff
        ])
      })
    })
  })
})
