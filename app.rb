require 'rubygems'
require 'sinatra'

class Sinatra::Application
end


get '/' do
    erb :index
end
