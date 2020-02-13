module Codeclimate
  module Collectors
    module Pagerduty
      module Handlers
        RSpec.describe Sync do
          let(:configuration) { stub_wrapped_configuration }
          let(:manager) { stub_manager }
          let(:request) do
            Collectors::Requests::Sync.new(earliest_data_cutoff: Time.now)
          end

          it "kicks off a request to fetch incidents" do
            handler = described_class.new(
              configuration: configuration,
              manager: manager,
              request: request,
            )

            handler.handle_request

            expect(manager.requests.received_requests.count).to eq(1)
            out_req = manager.requests.received_requests.first
            expect(out_req).to eq(
              Pagerduty::Requests::FetchIncidents.new(
                since: request.earliest_data_cutoff,
                offset: 0,
              )
            )
          end
        end
      end
    end
  end
end
