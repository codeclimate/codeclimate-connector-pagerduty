import { ClientConfiguration, Logger, VerifyConfigurationResult } from "codeclimate-collector-sdk"

import { ApiClient, ResponseError } from "./ApiClient"

export class ConfigurationVerifier {
  constructor(
    public configuration: ClientConfiguration,
    public logger: Logger,
  ) {
  }

  run(): Promise<VerifyConfigurationResult> {
    if (!this.apiTokenPresent()) {
      return Promise.resolve({
        isValid: false,
        errorMessages: ["api_token must be present"],
      })
    }

    return this.buildApiClient().get("abilities").
      then(() => {
        return { isValid: true }
      }).
      catch((err) => {
        let msg = "An error occurred"

        if (err instanceof ResponseError) {
          msg = err.message
        }

        return {
          isValid: false,
          errorMessages: [msg],
        }
      })
  }

  private apiTokenPresent() {
    return typeof this.configuration.get("api_token") === "string"
  }

  private buildApiClient() {
    return new ApiClient(this.configuration.get("api_token") as string)
  }
}