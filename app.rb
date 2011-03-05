require 'rubygems'
require 'sinatra'

class Sinatra::Application
end

get "/" do
  redirect '/q/#!/flower'
end

get '/q/' do
    erb :index
end
