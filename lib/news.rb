# Dotenv.load

class News



    def self.format(response)
        response = JSON.parse(response)
        response["articles"].each do |a| 
            a["source"] = a["source"]["name"]
        end
        response
    end

    def self.get() 
        format HTTParty.get("https://newsapi.org/v2/top-headlines?country=se&apiKey=#{ENV['news_key']}").body
    end


end