import {
  AbstractClient,
  ClientInterface,
  VerifyConfigurationResult,
} from "codeclimate-collector-sdk"

import { StreamSyncer } from "./StreamSyncer"

export class Client extends AbstractClient implements ClientInterface {
  async verifyConfiguration(): Promise<VerifyConfigurationResult> {
    this.logger.debug("TODO - implement verifyConfiguration")
    return Promise.resolve({ isValid: true })
  }

  async syncStream(_stream: object | null, earliestDataCutoff: Date): Promise<void> {
    const syncer = new StreamSyncer(
      this.configuration,
      this.manager,
      this.logger,
      earliestDataCutoff,
    )

    return syncer.run()
  }
}
