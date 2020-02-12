module Codeclimate
  module Collectors
    module Pagerduty
      module Handlers
        RSpec.describe VerifyConfiguration do
          let(:manager) { stub_manager }
          let(:request) { Collectors::Requests::VerifyConfiguration.new }

          it "handles a config missing a token" do
            handler = described_class.new(
              configuration: Pagerduty::Configuration.new(
                Codeclimate::Collectors::Configuration.new({}),
              ),
              manager: manager,
              request: request,
            )

            handler.handle_request

            expect(manager.messages.received_messages.count).to eq(1)
            msg = manager.messages.received_messages.first
            expect(msg).to be_a(Messages::ConfigurationVerification)
            expect(msg.state).to eq(Messages::ConfigurationVerification::ERROR)
            expect(msg.error_messages.first).to match(/token is missing/)
          end

          it "handles an invalid token" do
            handler = described_class.new(
              configuration: stub_wrapped_configuration,
              manager: manager,
              request: request,
            )

            stub_request(:get, "https://api.pagerduty.com/abilities").
              to_return(status: 401, body: "")

            handler.handle_request

            expect(manager.messages.received_messages.count).to eq(1)
            msg = manager.messages.received_messages.first
            expect(msg).to be_a(Messages::ConfigurationVerification)
            expect(msg.state).to eq(Messages::ConfigurationVerification::ERROR)
            expect(msg.error_messages.first).to match(/token is invalid/)
          end

          it "sends a successful message when everything works" do
            handler = described_class.new(
              configuration: stub_wrapped_configuration,
              manager: manager,
              request: request,
            )

            stub_request(:get, "https://api.pagerduty.com/abilities").
              to_return(body: JSON.generate({}))

            handler.handle_request

            expect(manager.messages.received_messages.count).to eq(1)
            msg = manager.messages.received_messages.first
            expect(msg).to be_a(Messages::ConfigurationVerification)
            expect(msg.state).to eq(Messages::ConfigurationVerification::SUCCESS)
          end
        end
      end
    end
  end
end
