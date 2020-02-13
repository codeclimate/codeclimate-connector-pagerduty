module Codeclimate
  module Collectors
    module Pagerduty
      class Client
        HANDLERS = {
          Codeclimate::Collectors::Requests::VerifyConfiguration => Pagerduty::Handlers::VerifyConfiguration,
          Codeclimate::Collectors::Requests::Sync => Pagerduty::Handlers::Sync,
        }.freeze

        def initialize(configuration:, manager:)
          @configuration = Configuration.new(configuration)
          @manager = manager
        end

        def handle_request(request)
          handler_klass = HANDLERS[request.class]

          if handler_klass.nil?
            raise ArgumentError, "Don't know how to process a request of type #{request.class}"
          end

          handler_klass.new(
            configuration: configuration,
            manager: manager,
            request: request,
          ).handle_request
        end

        private

        attr_reader :configuration, :manager
      end
    end
  end
end
