import {
  ClientConfiguration,
  Logger,
  RecordProducer,
  StateManager,
} from "codeclimate-connector-sdk"

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
    public stateManager: StateManager,
    public logger: Logger,
    public earliestDataCutoff: Date
  ) {
    assertIsString(configuration.get("apiToken"), "apiToken should be in config")

    this.apiClient = new ApiClient(configuration.get("apiToken"))
  }

  public run(): Promise<void> {
    let startPage = 1
    let state = this.stateManager.get()

    if (state && state.metadata) {
      startPage = state.metadata["nextPage"]
    }

    return this.processPage(startPage)
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
        this.stateManager.set({
          checkpointTime: new Date(incidents[incidents.length - 1]["created_at"]),
          metadata: { nextPage: page + 1 },
        })

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
        record: {
          _type: "Incident",
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
