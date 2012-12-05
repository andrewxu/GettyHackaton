require "json"
require "net/http"

module Api
  class NYT
    def initialize
      @endpoint = 'http://api.nytimes.com/svc/search/v1/article'
      @api_key = 'a33647e077772fbce68937749acf1614:0:67005581'
    end

    def get_articles(keyword)
      #http://developer.nytimes.com/docs/article_search_api#h2-responses
      # look for 'Data Fields' can grab
      request = @endpoint+'/?api-key='+@api_key+'&query='+keyword+'&fields=title,date,geo_facet'

      response = get_response(request)
      return response['results']
    end

    def get_response(request)
      uri = URI.parse(request)

      response = Net::HTTP.get_response(uri).body
      JSON.parse(response)
    end
  end
end
