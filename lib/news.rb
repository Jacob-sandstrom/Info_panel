# Dotenv.load

class News



    def self.format(response)
        response
    end

    def self.get() 
        format HTTParty.get("https://newsapi.org/v2/top-headlines?country=se&apiKey=#{ENV['news_key']}").body
    end


end