module Api
  class Twit
    def initialize
      TweetStream.configure do |config|
        config.consumer_key       = 'tpJxiHlK9imuVng7Ssr1g'
        config.consumer_secret    = 'uzVKqjht7z1Qv0FB927ApOoGMLr8OXkA7HAC8aKRuQM'
        config.oauth_token        = '990067262-f2hMmNKJ97aR2xMAwCkF9QLkrIxtcvrG69rsOU0Q"'
        config.oauth_token_secret = 'CuMBg43NMgnsICNXfYAsLlVhbNskGLFL7D8hGBFZ8'
        config.auth_method        = :oauth
      end

      @tweetClient = TweetStream::Client.new
    end

    def search(phrase)
      @statuses = []
      @tweetClient.sample do |status, client|
          @statuses << status
            client.stop if @statuses.size >= 1
      end

      return @statuses
    end
  end
end
