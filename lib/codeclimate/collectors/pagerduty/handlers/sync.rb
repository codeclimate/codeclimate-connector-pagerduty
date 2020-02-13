module Codeclimate
  module Collectors
    module Pagerduty
      module Handlers
        class Sync < Handler
          def handle_request
            manager.requests << Pagerduty::Requests::FetchIncidents.new(
              since: request.earliest_data_cutoff,
              offset: 0,
            )
          end
        end
      end
    end
  end
end
