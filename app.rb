require 'rubygems'
require 'sinatra'

class Sinatra::Application
end

get "/" do
  redirect '/q/#!/Coffee'
end

get '/q/' do
    erb :index
end
