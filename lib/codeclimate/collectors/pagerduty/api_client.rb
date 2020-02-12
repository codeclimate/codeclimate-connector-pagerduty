require "net/http"
require "uri"

module Codeclimate
  module Collectors
    module Pagerduty
      class ApiClient
        BASE_URL = "https://api.pagerduty.com".freeze

        ResponseError = Class.new(StandardError)
        NotFound = Class.new(ResponseError)
        Unauthorized = Class.new(ResponseError)
        ServerError = Class.new(ResponseError)

        def initialize(api_token)
          @api_token = api_token
        end

        def get(path, params = {})
          uri = construct_uri(path, params)
          req = Net::HTTP::Get.new(uri)
          set_headers(req)
          make_request(req)
        end

        private

        attr_reader :api_token

        def make_request(request)
          resp = http_client.request(request)

          case resp
          when Net::HTTPSuccess
            JSON.parse(resp.body)
          when Net::HTTPNotFound
            raise NotFound, "Resource not found"
          when Net::HTTPUnauthorized
            raise Unauthorized, "Invalid credentials"
          when Net::HTTPServerError
            raise ServerError, "Server error"
          else
            raise ResponseError, "Unsuccessful request: status=#{resp.status}"
          end
        end

        def set_headers(req)
          req["Authorization"] = "Token token=#{api_token}"
          req["Content-Type"] = "application/json"
          req["Accept"] = "application/vnd.pagerduty+json;version=2"
        end

        def http_client
          @http_client ||= begin
            base_uri = URI.parse(BASE_URL)

            Net::HTTP.new(base_uri.hostname, base_uri.port).tap do |c|
              c.use_ssl = true
            end
          end
        end

        def construct_uri(path, params = {})
          URI.parse(BASE_URL).tap do |uri|
            puts "construct_uri: initial = #{uri.inspect}"
            if path.start_with?("/")
              uri.path = path
            else
              uri.path = "/#{path}"
            end
            puts "construct_uri: after path set = #{uri.inspect}"

            if params.any?
              uri.query = URI.encode_www_form(params)
            end
          end
        end
      end
    end
  end
end
