import {
 ClientConfiguration,
 Logger,
 VerifyConfigurationResult,
} from "codeclimate-connector-sdk";

import { ApiClient, ResponseError } from "./ApiClient";

export interface ProcessEnv {
 [key: string]: string | undefined;
}

export class ConfigurationVerifier {
 constructor(
  public configuration: ClientConfiguration,
  public logger: Logger
 ) {}

 run(): Promise<VerifyConfigurationResult> {
  if (!this.apiTokenPresent()) {
   return Promise.resolve({
    isValid: false,
    errorMessages: ["apiToken must be present"],
   });
  }

  return this.buildApiClient()
   .get("abilities")
   .then(() => {
    return { isValid: true };
   })
   .catch((err) => {
    let msg = "An error occurred";

    if (err instanceof ResponseError) {
     msg = err.message;
    }

    return {
     isValid: false,
     errorMessages: [msg],
    };
   });
 }

 private apiTokenPresent() {
  return typeof process.env["API_TOKEN"] === "string";
 }

 private buildApiClient() {
  return new ApiClient(process.env["API_TOKEN"] as string);
 }
}
