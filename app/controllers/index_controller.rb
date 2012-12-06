class IndexController < ApplicationController
  require 'api/nyt.rb'
  require 'api/getty_connect.rb'
  require 'api/twitter.rb'
  #require 'api/twitter_stream.rb'
  require 'api/geocode.rb'

  def index
  end

  def test
    #@twt = Api::Tweet.new
    #@twts = @twt.search('christmas', true)
    
    #@nyt = Api::NYT.new
    #@twts = @nyt.get_geocode('calgary')

    @geo = Api::Geo.new
    #@twts = @geo.decode('Calgary')
  
    @gc = Api::GettyConnect.new
    @twts = @gc.search_image('Steve Jobs')
    @twts.to_json
    
    #@ts = Api::TwitStream.new
    #@twts = @ts.getData 
  end
end
