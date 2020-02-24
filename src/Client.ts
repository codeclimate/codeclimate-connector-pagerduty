import {
  AbstractClient,
  ClientInterface,
  VerifyConfigurationResult,
} from "codeclimate-collector-sdk"

export class Client extends AbstractClient implements ClientInterface {
  verifyConfiguration(): VerifyConfigurationResult {
    this.logger.debug("TODO - implement verifyConfiguration")
    return { isValid: true }
  }

  syncStream(_streamId: string | null, _earliestDataCutoff: Date): void {
    this.logger.debug("TODO - implement syncStream")
  }
}
