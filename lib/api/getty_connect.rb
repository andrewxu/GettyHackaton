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

    def decode(city_name)
      geo = Geocoder.search("New York City").first
      coord = geo.geometry['location']
      return {
        'long' => coord['lng'],
        'lat' => coord['lat']
      }
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
              :Filter => { :ImageFamilies => ["editorial"] }
          }
      }

      response = post_json(request, endpoint)

      if (response['ResponseHeader']['Status'] == 'success')
        images = response['SearchForImagesResult']['Images']
        the_image = images.sample
        image_details = get_details(the_image["ImageId"])
    
        return {
          'image' => the_image["UrlPreview"],
          'city' => image_details["GetImageDetailsResult"]["Images"].first["City"],
          'coords' => decode(image_details["GetImageDetailsResult"]["Images"].first["City"]), 
          'word' => phrase
        }
      else 
        return response;
      end
    end

    def get_details(image_id)
      endpoint = "http://connect.gettyimages.com/v1/search/GetImageDetails"
      request = {
          :RequestHeader => { :Token => @token},
          :GetImageDetailsRequestBody => {
              :ImageIds => [
                image_id
              ]
          }
      }

      response = post_json(request, endpoint)
      return response
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
