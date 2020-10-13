require 'bundler'

Bundler.require

require_relative 'lib/calendar'
require_relative 'lib/trafiklabs'
require_relative 'lib/smhi'
require_relative 'app'

run Server