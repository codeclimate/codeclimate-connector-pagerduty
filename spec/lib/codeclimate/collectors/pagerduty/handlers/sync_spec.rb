module Codeclimate
  module Collectors
    module Pagerduty
      module Handlers
        RSpec.describe Sync do
          let(:configuration) { stub_wrapped_configuration }
          let(:manager) { stub_manager }
          let(:data_cutoff) { Time.parse("2020-02-13T00:00:00Z") }

          describe "processing" do
            before do
              stub_request(:get, "https://api.pagerduty.com/incidents?limit=100&offset=0&since=2020-02-13T00:00:00Z").  to_return(
                  status: 200,
                  body: JSON.generate(
                    incidents: [
                      {
                        id: "c3d4",
                        created_at: Time.now.iso8601,
                        status: "acknowledged",
                        title: "current incident",
                        incident_number: 42,
                        html_url: "http://example.com",
                      },
                      {
                        id: "a1b2",
                        created_at: (Time.now - 99999).iso8601,
                        status: "resolved",
                        title: "old incident",
                        incident_number: 41,
                        html_url: "http://example.com",
                      },
                    ],
                    more: true,
                  ),
                )

              stub_request(:get, "https://api.pagerduty.com/incidents?limit=100&offset=100&since=2020-02-13T00:00:00Z").  to_return(
                  status: 200,
                  body: JSON.generate(
                    incidents: [
                      {
                        id: "e5f6",
                        created_at: Time.now.iso8601,
                        status: "resolved",
                        title: "older incident",
                        incident_number: 40,
                        html_url: "http://example.com",
                      },
                    ],
                    more: false,
                  ),
                )
            end

            it "sends messages for incidents" do
              handler = described_class.new(
                configuration: configuration,
                manager: manager,
                earliest_data_cutoff: data_cutoff,
              )

              handler.run

              expect(manager.messages.received_messages.count).to eq(3)
            end
          end
        end
      end
    end
  end
end
