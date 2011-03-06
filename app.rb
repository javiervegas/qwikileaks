require 'rubygems'
require 'sinatra'

class Sinatra::Application
end

#get "/" do
  #redirect '/q/#!/Coffee'
#end

get '/' do
    erb :index
end
