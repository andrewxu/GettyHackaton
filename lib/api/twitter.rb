module Api
  class Twit
    def initialize
      @client = Twitter::Client.new(
        :consumer_key => "tpJxiHlK9imuVng7Ssr1g",
        :consumer_secret => "uzVKqjht7z1Qv0FB927ApOoGMLr8OXkA7HAC8aKRuQM",
        :oauth_token => "990067262-f2hMmNKJ97aR2xMAwCkF9QLkrIxtcvrG69rsOU0Q",
        :oauth_token_secret => "CuMBg43NMgnsICNXfYAsLlVhbNskGLFL7D8hGBFZ8"
      )
    end

    def search(phrase)
      @client.search(phrase, :count => 3, :geocode => "39.50,-98.35,200mi", :result_type => "recent")
      #@tweets = @client.query :q => phrase, :geocode => '43.4411,-70.9846mi'
    end
  end
end
