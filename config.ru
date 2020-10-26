require 'bundler'

Bundler.require

Dotenv.load
require_relative 'lib/news'
require_relative 'lib/calendar'
require_relative 'lib/trafiklabs'
require_relative 'lib/smhi'
require_relative 'app'

run Server