import { Stream } from "codeclimate-connector-sdk"
import {
  buildFakeLogger,
  buildFakeRecordProducer,
  buildFakeStateManager,
} from "codeclimate-connector-sdk/lib/TestHelpers"

import { Client } from "../Client"
import { StreamSyncer } from "../StreamSyncer"
import { ConfigurationVerifier } from "../ConfigurationVerifier"

jest.mock("../StreamSyncer")
jest.mock("../ConfigurationVerifier")

describe(Client, () => {
  function buildClient(): Client {
    return new Client(
      new Map([
        ["apiToken", "fake-key"],
      ]),
      buildFakeRecordProducer(),
      buildFakeStateManager(),
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

      const stream = new Stream({
        _type: "Stream",
        id: "unknown",
        self: "https://pagerduty.com",
        name: "PagerDuty account"
      })
      const cutoff = new Date()

      return client.syncStream(stream, cutoff).then(() => {
        const mock = (StreamSyncer as any).mock
        expect(mock.calls.length).toBe(1)
        expect(mock.calls[0]).toEqual([
          client.configuration, client.recordProducer, client.stateManager, client.logger, cutoff
        ])
      })
    })
  })
})
