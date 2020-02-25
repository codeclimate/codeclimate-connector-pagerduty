import {
  AbstractClient,
  ClientInterface,
  VerifyConfigurationResult,
} from "codeclimate-collector-sdk"

export class Client extends AbstractClient implements ClientInterface {
  verifyConfiguration(): Promise<VerifyConfigurationResult> {
    this.logger.debug("TODO - implement verifyConfiguration")
    return Promise.resolve({ isValid: true })
  }

  syncStream(_streamId: string | null, _earliestDataCutoff: Date): Promise<void> {
    this.logger.debug("TODO - implement syncStream")

    return Promise.resolve()
  }
}
