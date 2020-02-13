module Codeclimate
  module Collectors
    module Pagerduty
      module Handlers
        class Handler
          def initialize(configuration:, manager:, request:)
            @configuration = configuration
            @manager = manager
            @request = request
          end

          def handle_request
            raise NotImplementedError, "subclasses should implement this"
          end

          protected

          attr_reader :configuration, :manager, :request

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

