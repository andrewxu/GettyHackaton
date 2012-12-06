require "json"
require "net/http"
require "net/https"

module Api
  class GettyConnect
    attr_accessor :system_id, :system_pwd, :user_name, :user_pwd

    def initialize
      @system_id = "10212"
      @system_pwd = "RQdCMXOOyWHnUhhQtuivnx8NzEOIXINfsa5zSFPJGK4="
      @user_name = "hackathon2012"
      @user_pwd = "sPEbA41EPPXbamy"

      # initialize api by getting a token
      create_session
    end

    def create_session
      endpoint = "https://connect.gettyimages.com/v1/session/CreateSession"
      request = {
          :RequestHeader =>
              {
                  :Token => ""
              },
          :CreateSessionRequestBody =>
              {
                  :SystemId => @system_id,
                  :SystemPassword => @system_pwd,
                  :UserName => @user_name,
                  :UserPassword => @user_pwd
              }
      }

      response = post_json(request, endpoint)
      @token = response["CreateSessionResult"]["Token"]
      @secure_token = response["CreateSessionResult"]["SecureToken"]
      @status = response["ResponseHeader"]["Status"]

      return @status 
    end
      
    def search_image(phrase)
      endpoint = "http://connect.gettyimages.com/v1/search/SearchForImages"
      request = {
          :RequestHeader => { :Token => @token},
          :SearchForImages2RequestBody => {
              :Query => { :SearchPhrase => phrase},
              :ResultOptions => {
                  :ItemCount => 25,
                  :ItemStartNumber => 1
              },
              :Filter => { :ImageFamilies => ["creative"] }
          }
      }

      response = post_json(request, endpoint)

      if (response['ResponseHeader']['Status'] == 'success')
        return response['SearchForImagesResult']['Images']
      else 
        return response;
      end
    end

    def post_json(request, endpoint)
      #You may wish to replace this code with your preferred library for posting and receiving JSON data.
      uri = URI.parse(endpoint)
      http = Net::HTTP.new(uri.host, 443)
      http.use_ssl = true

      response = http.post(uri.path, request.to_json, {'Content-Type' =>'application/json'}).body
      JSON.parse(response)
    end
  end
end
