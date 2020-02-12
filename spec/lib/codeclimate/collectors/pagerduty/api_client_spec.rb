module Codeclimate
  module Collectors
    module Pagerduty
      RSpec.describe ApiClient do
        it "raises on an unauthorized response" do
          stub_request(:get, "https://api.pagerduty.com/incidents").
            to_return(status: 401, body: "")

          c = described_class.new("token")
          expect {
            c.get("incidents")
          }.to raise_error(described_class::Unauthorized)
        end

        it "parses JSON of sucessful requests" do
          stub_request(:get, "https://api.pagerduty.com/incidents").
            to_return(body: JSON.generate({ incidents: [] }))

          c = described_class.new("token")
          expect(c.get("incidents")).to eq("incidents" => [])
        end
      end
    end
  end
end
