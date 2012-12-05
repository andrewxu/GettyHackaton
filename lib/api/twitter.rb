require 'rubygems'
require 'twitter'
require 'net/http'
require 'uri'

module Api
  class Tweet
    def initialize
      @client = Twitter::Client.new(
        :consumer_key => "tpJxiHlK9imuVng7Ssr1g",
        :consumer_secret => "uzVKqjht7z1Qv0FB927ApOoGMLr8OXkA7HAC8aKRuQM",
        :oauth_token => "990067262-f2hMmNKJ97aR2xMAwCkF9QLkrIxtcvrG69rsOU0Q",
        :oauth_token_secret => "CuMBg43NMgnsICNXfYAsLlVhbNskGLFL7D8hGBFZ8"
      )
    end

    def search(phrase, onlyGeo = true)
      @statuses = []
      @client.search(phrase, :count => 100, :geocode => '40.71,74.00,10000mi', :result_type => "mixed").results.map do |status|
        if (onlyGeo) 
          if (status.geo)
            tweet = {
              'created_at' => status.created_at,
              'from' => status.from_user,
              'text' => status.text,
              'coordinates' => status.geo.coordinates
            }
            @statuses << tweet
          else
            #skip it
          end
        else
          tweet = {
            'created_at' => status.created_at,
            'from' => status.from_user,
            'text' => status.text,
            'coordinates' => status.geo.coordinates
          }
          @statuses << tweet
        end
      end
      return @statuses
    end
  end
end
