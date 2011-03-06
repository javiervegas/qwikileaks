require 'rubygems'
require 'sinatra'
require 'haml'
require 'sass'


class Sinatra::Application
end

get '/' do
    erb :index
end

get '/h/' do
    haml :index
end

get '/stylesheet.css' do
    sass :stylesheet
end
