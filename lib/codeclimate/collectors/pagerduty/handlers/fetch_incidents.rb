module Codeclimate
  module Collectors
    module Pagerduty
      module Handlers
        class FetchIncidents < Handler
          LIMIT = 100

          def handle_request
            api_response["incidents"].each do |incident_json|
              process_incident(incident_json)
            end

            if api_response["more"]
              enqueue_next_page
            end
          end

          private

          def process_incident(incident_json)
            manager.messages << Messages::Incident.new(
              external_id: incident_json.fetch("id"),
              status: incident_json.fetch("status"),
              number: incident_json.fetch("incident_number"),
              title: incident_json.fetch("title"),
              created_at: Time.parse(incident_json.fetch("created_at")),
              url: incident_json.fetch("html_url"),
            )
          end

          def enqueue_next_page
            manager.requests << Pagerduty::Requests::FetchIncidents.new(
              since: request.since,
              offset: request.offset + LIMIT,
            )
          end

          def api_response
            @api_response = api_client.get(
              "incidents",
              limit: LIMIT,
              offset: request.offset,
              since: request.since.iso8601,
            )
          end
        end
      end
    end
  end
end
