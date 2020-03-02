import * as nock from "nock"
import { buildFakeRecordProducer, buildFakeLogger } from "codeclimate-collector-sdk/lib/TestHelpers"

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
              self: "https://example.com/incident/42",
              status: "acknowledged",
              incident_number: 42,
              title: "incident 42",
              created_at: new Date().toISOString(),
              html_url: "https://example.com",
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
              self: "https://example.com/incident/41",
              status: "resolved",
              incident_number: 41,
              title: "incident 41",
              created_at: new Date().toISOString(),
              html_url: "https://example.com",
            },
          ],
          more: false,
        }),
      )

    const recordProducer = buildFakeRecordProducer()
    const syncer = new StreamSyncer(
      new Map([["apiToken", "fake-token"]]),
      recordProducer,
      buildFakeLogger(),
      new Date(new Date().valueOf() - 100_000_000),
    )

    return syncer.run().then(() => {
      expect(recordProducer.records.length).toBe(2)
    })
  })
})
