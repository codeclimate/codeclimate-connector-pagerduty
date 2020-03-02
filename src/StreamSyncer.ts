import { ClientConfiguration, RecordProducer, Logger } from "codeclimate-collector-sdk"

import { ApiClient } from "./ApiClient"

const PER_PAGE = 100

function assertIsString(val: any, message: string): asserts val is string {
  if (typeof val !== "string") {
    throw new TypeError(message)
  }
}

export class StreamSyncer {
  apiClient: ApiClient

  constructor(
    public configuration: ClientConfiguration,
    public recordProducer: RecordProducer,
    public logger: Logger,
    public earliestDataCutoff: Date
  ) {
    assertIsString(configuration.get("apiToken"), "apiToken should be in config")

    this.apiClient = new ApiClient(configuration.get("apiToken"))
  }

  public run(): Promise<void> {
    return this.processPage(1)
  }

  private processPage(page: number): Promise<void> {
    return this.apiClient.get(
      "incidents",
      {
        limit: PER_PAGE,
        offset: (page - 1) * PER_PAGE,
      }
    ).then((resp) => {
      const incidents: object[] = resp["incidents"] || []

      incidents.forEach((incident) => this.processIncident(incident))

      if (
        resp["more"] &&
        incidents.length > 0 &&
        new Date(incidents[incidents.length - 1]["created_at"]) >= this.earliestDataCutoff
      ) {
        return this.processPage(page + 1)
      } else {
        return
      }
    })
  }

  // https://api-reference.pagerduty.com/#!/Incidents/get_incidents
  private processIncident(incident: object) {
    if (new Date(incident["created_at"]) >= this.earliestDataCutoff) {
      this.recordProducer.produce({
        type: "Incident",
        attributes: {
          id: incident["id"],
          self: incident["self"],
          status: incident["status"],
          number: incident["incident_number"],
          title: incident["title"],
          createdAt: incident["created_at"],
          htmlUrl: incident["html_url"],
        }
      })
    }
  }
}
