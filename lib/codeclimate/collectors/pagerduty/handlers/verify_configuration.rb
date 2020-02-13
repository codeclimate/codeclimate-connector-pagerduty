module Codeclimate
  module Collectors
    module Pagerduty
      module Handlers
        class VerifyConfiguration < Handler
          def handle_request
            if !configuration.valid?
              send_message(
                Messages::ConfigurationVerification.new(
                  state: Messages::ConfigurationVerification::ERROR,
                  error_messages: ["API token is missing."],
                )
              )
              return
            end

            if token_valid?
              send_message(
                Messages::ConfigurationVerification.new(
                  state: Messages::ConfigurationVerification::SUCCESS,
                )
              )
            else
              send_message(
                Messages::ConfigurationVerification.new(
                  state: Messages::ConfigurationVerification::ERROR,
                  error_messages: ["API token is invalid."],
                )
              )
            end
          end

          def token_valid?
            api_client.get("abilities")
            true
          rescue ApiClient::Unauthorized
            false
          end
        end
      end
    end
  end
end
