import {
  AbstractClient,
  ClientInterface,
  VerifyConfigurationResult,
} from "codeclimate-collector-sdk"

import { StreamSyncer } from "./StreamSyncer"

export class Client extends AbstractClient implements ClientInterface {
  verifyConfiguration(): Promise<VerifyConfigurationResult> {
    this.logger.debug("TODO - implement verifyConfiguration")
    return Promise.resolve({ isValid: true })
  }

  syncStream(_streamId: string | null, earliestDataCutoff: Date): Promise<void> {
    const syncer = new StreamSyncer(
      this.configuration,
      this.manager,
      this.logger,
      earliestDataCutoff,
    )

    return syncer.run()
  }
}
