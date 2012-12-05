class IndexController < ApplicationController
  require 'api/nyt.rb'
  require 'api/getty_connect.rb'
  require 'api/twitter.rb'

  def index

  end

  def test
    @twt = Api::Tweet.new
    @twts = @twt.search('christmas', true)
  end
end
