require 'rubygems'
require 'sinatra'

class Sinatra::Application
end

get "/" do
  redirect '/q/#!/Cheese'
end

get '/q/' do
    puts request.inspect
    @term = 'Cheese'
    erb :index
end
