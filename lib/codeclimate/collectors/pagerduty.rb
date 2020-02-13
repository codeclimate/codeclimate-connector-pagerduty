require "codeclimate-collector-manager"

require "codeclimate/collectors/pagerduty/handlers"
require "codeclimate/collectors/pagerduty/requests"

require "codeclimate/collectors/pagerduty/api_client"
require "codeclimate/collectors/pagerduty/client"
require "codeclimate/collectors/pagerduty/configuration"

module Codeclimate
  module Collectors
    module Pagerduty
      VERSION = File.read(File.expand_path("../../../../VERSION", __FILE__)).strip
    end
  end
end
