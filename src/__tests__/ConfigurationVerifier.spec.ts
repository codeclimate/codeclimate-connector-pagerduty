import * as nock from "nock"
import { buildFakeLogger } from "codeclimate-collector-sdk/lib/TestHelpers"

import { ConfigurationVerifier } from "../ConfigurationVerifier"

nock.disableNetConnect()

describe(ConfigurationVerifier, () => {
  test("says valid config is valid", () => {
    nock("https://api.pagerduty.com").
      get("/abilities").
      reply(
        200,
        JSON.stringify({}),
      )

    const verifier = new ConfigurationVerifier(
      new Map([
        ["api_token", "fake-key"],
      ]),
      buildFakeLogger(),
    )

    return verifier.run().then((result) => {
      expect(result.isValid).toBe(true)
    })
  })

  test("says config missing api key is invalid", () => {
    const verifier = new ConfigurationVerifier(
      new Map([
        ["api_token", "fake-key"],
      ]),
      buildFakeLogger(),
    )

    return verifier.run().then((result) => {
      expect(result.isValid).toBe(false)
      expect(result.errorMessages).toBeDefined()
      expect(result.errorMessages!.length).toBe(1)
    })
  })

  test("says config is invalid if API key fails", () => {
    nock("https://api.pagerduty.com").
      get("/abilities").
      reply(
        401,
        JSON.stringify({}),
      )

    const verifier = new ConfigurationVerifier(
      new Map([
        ["api_token", "fake-key"],
      ]),
      buildFakeLogger(),
    )

    return verifier.run().then((result) => {
      expect(result.isValid).toBe(false)
      expect(result.errorMessages).toBeDefined()
      expect(result.errorMessages!.length).toBe(1)
    })
  })
})
