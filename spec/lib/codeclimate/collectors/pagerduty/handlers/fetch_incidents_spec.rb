module Codeclimate
  module Collectors
    module Pagerduty
      module Handlers
        RSpec.describe FetchIncidents do
          let(:configuration) { stub_wrapped_configuration }
          let(:manager) { stub_manager }

          describe "processing an initial request" do
            let(:request) do
              Pagerduty::Requests::FetchIncidents.new(
                since: Time.parse("2020-02-13T00:00:00Z"),
                offset: 0,
              )
            end

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
                    more: response_has_more,
                  ),
                )
            end

            describe "a response indicating more pages" do
              let(:response_has_more) { true }

              it "sends messages for incidents" do
                handler = described_class.new(
                  configuration: configuration,
                  manager: manager,
                  request: request,
                )

                handler.handle_request

                expect(manager.messages.received_messages.count).to eq(2)
              end

              it "submits a request for the next page" do
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
                    since: request.since,
                    offset: described_class::LIMIT,
                  )
                )
              end
            end

            describe "a response indicating no more pages" do
              let(:response_has_more) { false }

              it "does not submit another request" do
                handler = described_class.new(
                  configuration: configuration,
                  manager: manager,
                  request: request,
                )

                handler.handle_request

                expect(manager.requests.received_requests).to be_empty
              end
            end
          end
        end
      end
    end
  end
end
