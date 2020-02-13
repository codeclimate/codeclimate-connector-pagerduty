module Codeclimate
  module Collectors
    module Pagerduty
      module Requests
        class FetchIncidents < Collectors::Requests::Request
          argument :offset, Integer
          argument :since, Time
        end
      end
    end
  end
end
