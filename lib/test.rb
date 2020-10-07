require 'httparty'

max_journeys = 2

response = HTTParty.get("https://api.resrobot.se/v2/departureBoard?key=dc6277a9-744a-4bae-96b5-54bca1f84b88&id=740015681&maxJourneys=#{max_journeys}&format=json")

response["Departure"].each do |buss| 

name = buss["Product"]["num"]
dep_time = buss["Stops"]["Stop"][0]["depTime"]

p "name: #{name}"
p "deptime: #{dep_time}"

puts "\n"


end