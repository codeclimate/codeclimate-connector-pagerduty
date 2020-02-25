import * as nock from "nock"
import { ApiClient, ResponseError } from "../ApiClient"

describe(ApiClient, () => {
  beforeAll(() => nock.disableNetConnect())
  afterEach(() => nock.cleanAll())

  describe(".get", () => {
    test("basic request/response works", () => {
      nock("https://api.pagerduty.com").
        get("/incidents?page=2").
        reply(
          200,
          JSON.stringify({
            incidents: [
              { id: "abc123" },
            ],
          }),
        )

      const client = new ApiClient("fake-token")

      return client.get("incidents", { page: 2 }).then((resp) => {
        expect(resp["incidents"]).toEqual([
          { id: "abc123" },
        ])
      })
    })

    test("it throws on bad response", () => {
      nock("https://api.pagerduty.com").
        get("/incidents").
        reply(
          500,
          ""
        )

      const client = new ApiClient("fake-token")

      return expect(client.get("incidents")).rejects.toBeInstanceOf(ResponseError)
    })
  })
})
