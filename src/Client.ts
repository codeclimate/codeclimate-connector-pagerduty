import {
  AbstractClient,
  ClientInterface,
  VerifyConfigurationResult,
} from "codeclimate-collector-sdk"

import { ConfigurationVerifier } from "./ConfigurationVerifier"
import { StreamSyncer } from "./StreamSyncer"

export class Client extends AbstractClient implements ClientInterface {
  async verifyConfiguration(): Promise<VerifyConfigurationResult> {
    const verifier = new ConfigurationVerifier(this.configuration, this.logger)

    return verifier.run()
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
