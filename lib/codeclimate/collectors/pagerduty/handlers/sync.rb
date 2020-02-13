module Codeclimate
  module Collectors
    module Pagerduty
      module Handlers
        class Sync < Handler
          LIMIT = 100

          def initialize(configuration:, manager:, earliest_data_cutoff:)
            super(configuration: configuration, manager: manager)
            @earliest_data_cutoff = earliest_data_cutoff
          end

          def run
            page = 1
            has_more = true

            while has_more
              page_data = fetch_page(page)

              page_data["incidents"].each do |incident_json|
                process_incident(incident_json)
              end

              has_more = page_data["more"]
              page += 1
            end
          end

          private

          attr_reader :earliest_data_cutoff

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

          def fetch_page(page)
            @api_response = api_client.get(
              "incidents",
              limit: LIMIT,
              offset: (page - 1) * LIMIT,
              since: earliest_data_cutoff.iso8601,
            )
          end
        end
      end
    end
  end
end
