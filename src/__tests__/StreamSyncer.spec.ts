import * as nock from "nock"
import { buildFakeManager, buildFakeLogger, FakeManager } from "codeclimate-collector-sdk/lib/TestHelpers"

import { StreamSyncer } from "../StreamSyncer"

nock.disableNetConnect()

describe(StreamSyncer, () => {
  test("it syncs 2 pages of incidents", () => {
    nock("https://api.pagerduty.com").
      get("/incidents?limit=100&offset=0").
      reply(
        200,
        JSON.stringify({
          incidents: [
            {
              id: "abc123",
              status: "acknowledged",
              incident_number: 42,
              title: "incident 42",
              created_at: new Date().toISOString(),
              html_url: "https://example.com",
              self: "https://example.com/",
            },
          ],
          more: true,
        }),
      )

    nock("https://api.pagerduty.com").
      get("/incidents?limit=100&offset=100").
      reply(
        200,
        JSON.stringify({
          incidents: [
            {
              id: "def456",
              status: "resolved",
              incident_number: 41,
              title: "incident 41",
              created_at: new Date().toISOString(),
              html_url: "https://example.com",
              self: "https://example.com/",
            },
          ],
          more: false,
        }),
      )

    const manager: FakeManager = buildFakeManager()
    const syncer = new StreamSyncer(
      new Map([["api_token", "fake-token"]]),
      manager,
      buildFakeLogger(),
      new Date(new Date().valueOf() - 100_000_000),
    )

    return syncer.run().then(() => {
      expect(manager.sentMessages.length).toBe(2)
    })
  })
})
