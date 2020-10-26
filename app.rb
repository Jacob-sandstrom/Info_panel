class Server < Sinatra::Base
    get '/' do
        slim :index
      
    end

    
    get '/api/busses' do
        Trafiklabs.get(5).to_json
    end

    get '/api/weather' do
        Smhi.get().to_json
    end

    get '/api/calendar/:num_days' do
        # CalendarHandler.get().to_json
        CalendarHandler.get({num_days: params["num_days"].to_i}).to_json
    end

    get '/api/news' do
        News.get()
    end



  end