class IndexController < ApplicationController
  require 'api/nyt.rb'
  require 'api/getty_connect.rb'
  require 'api/twitter.rb'

  def index
    @twt = Api::Tweet.new
    @twts = @twt.search('apple', true)
  end
end
