lib = File.expand_path("../lib", __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)

Gem::Specification.new do |spec|
  spec.name          = "codeclimate-collector-pagerduty"
  spec.version       = File.read(File.expand_path("../VERSION", __FILE__)).strip
  spec.authors       = ["Code Climate"]
  spec.email         = ["hello@codeclimate.com"]
  spec.license       = "Nonstandard"
  spec.summary       = "Code Climate PagerDuty Collector"
  spec.description   = "Collector for integrating PagerDuty data into Velocity"
  spec.homepage      = "https://codeclimate.com"

  spec.files         += Dir["VERSION", "lib/**/*"]
  spec.require_paths = ["lib"]

  spec.add_dependency "codeclimate-collector-manager"

  spec.add_development_dependency "rspec"
  spec.add_development_dependency "pry"
  spec.add_development_dependency "webmock"
end
