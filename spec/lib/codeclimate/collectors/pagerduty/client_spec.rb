module Codeclimate
  module Collectors
    module Pagerduty
      RSpec.describe Client do
        describe ".verify_configuration" do
          it "calls the appropriate handler" do
            handler = double(Pagerduty::Handlers::VerifyConfiguration)
            expect(handler).to receive(:run).once
            expect(Pagerduty::Handlers::VerifyConfiguration).to receive(:new).
              with(
                configuration: anything,
                manager: anything,
              ).
              and_return(handler)

            client = described_class.validate_configuration(
              configuration: stub_configuration,
              manager: stub_manager,
            )
          end
        end

        describe ".sync" do
          it "calls an appropriate handler" do
            handler = double(Pagerduty::Handlers::Sync)
            expect(handler).to receive(:run).once
            expect(Pagerduty::Handlers::Sync).to receive(:new).
              with(
                configuration: anything,
                manager: anything,
                earliest_data_cutoff: anything,
              ).
              and_return(handler)

            described_class.sync(
              configuration: stub_configuration,
              manager: stub_manager,
              earliest_data_cutoff: Time.now,
            )
          end
        end
      end
    end
  end
end
