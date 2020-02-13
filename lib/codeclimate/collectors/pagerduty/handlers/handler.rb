module Codeclimate
  module Collectors
    module Pagerduty
      module Handlers
        class Handler
          def initialize(configuration:, manager:)
            @configuration = configuration
            @manager = manager
          end

          def run
            raise NotImplementedError, "subclasses should implement this"
          end

          protected

          attr_reader :configuration, :manager

          def api_client
            @api_client ||= ApiClient.new(configuration.api_token)
          end

          def send_message(message)
            manager.messages.send_message( message)
          end
        end
      end
    end
  end
end

