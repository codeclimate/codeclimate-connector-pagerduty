module Factories
  def stub_configuration
    Codeclimate::Collectors::Configuration.new(
      api_token: "test",
    )
  end

  def stub_wrapped_configuration
    Codeclimate::Collectors::Pagerduty::Configuration.new(stub_configuration)
  end
end
