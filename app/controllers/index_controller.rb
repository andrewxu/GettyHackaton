class IndexController < ApplicationController
  require 'api/nyt.rb'
  require 'api/getty_connect.rb'
  require 'api/twitter.rb'

  def index
    #@nyt = Api::NYT.new
    #@news = @nyt.get_articles('hurricane&sandy')
    #@gc = Api::GettyConnect.new
    #@gct = @gc.search_image('cat')
    @twt = Api::Twit.new
    @twts = @twt.search('justin')
  end
end
