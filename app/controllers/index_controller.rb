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
    @twts = @gc.search_image('Mickey', 100)

    respond_to do |format|
      format.html # show.html.erb
      format.json { render :json => @twts.to_json }
end
    #@ts = Api::TwitStream.new
    #@twts = @ts.getData 
  end
end
