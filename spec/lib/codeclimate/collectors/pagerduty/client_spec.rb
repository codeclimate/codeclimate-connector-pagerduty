module Codeclimate
  module Collectors
    module Pagerduty
      RSpec.describe Client do
        describe "#handle_request" do
          it "raises given a request type we don't know about" do
            client = described_class.new(
              configuration: stub_configuration,
              manager: stub_manager,
            )
            req_class = Class.new(Collectors::Requests::Request)

            expect {
              client.handle_request(req_class.new)
            }.to raise_error(ArgumentError)
          end

          it "calls an appropriate handler" do
            client = described_class.new(
              configuration: stub_configuration,
              manager: stub_manager,
            )
            req = Collectors::Requests::VerifyConfiguration.new

            expect(Pagerduty::Handlers::VerifyConfiguration).to receive(:new).
              with(
                configuration: anything,
                manager: anything,
                request: req,
              ).
              and_return(double(handle_request: true))


            client.handle_request(req)
          end
        end
      end
    end
  end
end
