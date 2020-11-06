# Dotenv.load

class News



    def self.format(response)
        p response["data"].class
        response["data"]["children"].map {|post| post["data"]["title"] } 
    end


    def self.get_access_token()
        encoded_auth = Base64.encode64("#{ENV['reddit_client_id']}:#{ENV['reddit_client_secret']}")
        headers = {Authorization: "Basic #{encoded_auth}",
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "web:info_panel:v1.0 (by /u/SnooComics4566)"}
        body = {grant_type: "client_credentials"}
        options = {headers: headers, body: body}
        HTTParty.post("https://www.reddit.com/api/v1/access_token", options)["access_token"]
    end

    def self.default_params_for_get() {subreddit: "news", limit: 2} end
    def self.get(params = default_params_for_get)
        default_params_for_get.map {|k, v| params[k] = v if params[k] == nil }
        access_token = get_access_token()
        options = {headers: {Authorization: "Bearer #{access_token}", "User-Agent": "web:info_panel:v1.0 (by /u/SnooComics4566)"}}
        format HTTParty.get("https://oauth.reddit.com/r/#{params[:subreddit]}/top/?t=day&limit=#{params[:limit]}", options).parsed_response
    end


end