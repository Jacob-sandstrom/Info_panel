# Dotenv.load

class News



    def self.format(response)
        response = JSON.parse(response)
        response["articles"].each do |a| 
            a["title"] = a["title"].split(" - ")[0]
            a["source"] = a["source"]["name"]
        end
        response["articles"] = response["articles"].uniq
        response
    end

    def self.get() 
        format HTTParty.get("https://newsapi.org/v2/top-headlines?category=science&apiKey=#{ENV['news_key']}").body
    end


end