import {
 AbstractClient,
 ClientInterface,
 VerifyConfigurationResult,
 Stream,
 RecordProducer,
 RecordProducerFacade,
} from "codeclimate-connector-sdk";

import { ApiClient } from "./ApiClient";

import { ConfigurationVerifier } from "./ConfigurationVerifier";
import { StreamSyncer } from "./StreamSyncer";

export class Client extends AbstractClient implements ClientInterface {
 async verifyConfiguration(): Promise<VerifyConfigurationResult> {
  const verifier = new ConfigurationVerifier(this.configuration, this.logger);

  return verifier.run();
 }

 // AFAICT the PagerDuty API reveals no details about the name of the account
 // the token is from, so we just hard-code a single Stream, and ignore the
 // stream argument to syncStream
 async discoverStreams(): Promise<void> {
  return new Promise((resolve, _reject) => {
   this.recordProducer.produce({
    record: {
     _type: "Stream",
     id: "unavailable",
     self: "https://pagerduty.com",
     name: "PagerDuty Account",
    },
   });

   resolve();
  });
 }

 async syncStream(_stream: Stream, earliestDataCutoff: Date): Promise<void> {
  const syncer = new StreamSyncer(
   this.configuration,
   this.buildRecordProducer(),
   this.stateManager,
   this.logger,
   earliestDataCutoff
  );

  return syncer.run();
 }

 buildRecordProducer(): RecordProducer {
  let velocityToken: any = process.env["VELOCITY_API_TOKEN"];
  let apiClient = new ApiClient(velocityToken);
  let path = "/path/to/events/api";

  return new RecordProducerFacade({
   produce: (envelope) => {
    apiClient.post(path, envelope.record);
   },
  });
 }
}
