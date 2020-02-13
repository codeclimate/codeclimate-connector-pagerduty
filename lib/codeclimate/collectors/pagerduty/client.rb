module Codeclimate
  module Collectors
    module Pagerduty
      class Client
        def self.validate_configuration(configuration:, manager:)
          Handlers::VerifyConfiguration.new(
            configuration: Configuration.new(configuration),
            manager: manager,
          ).run
        end

        def self.sync(configuration:, manager:, earliest_data_cutoff:)
          Handlers::Sync.new(
            configuration: Configuration.new(configuration),
            manager: manager,
            earliest_data_cutoff: earliest_data_cutoff,
          ).run
        end

        private

        attr_reader :configuration, :manager
      end
    end
  end
end
