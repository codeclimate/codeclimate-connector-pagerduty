module Codeclimate
  module Collectors
    module Pagerduty
      class Configuration
        attr_reader :config

        def initialize(config)
          @config = config
        end

        def api_token
          config.fetch(:api_token)
        end

        def valid?
          config[:api_token].present?
        end
      end
    end
  end
end
