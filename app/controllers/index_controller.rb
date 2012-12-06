class IndexController < ApplicationController
  require 'api/nyt.rb'
  require 'api/getty_connect.rb'
  require 'api/twitter.rb'

  def index
    # @twt = Api::Twit.new
    # @twts = @twt.search('justin')
  end
end
