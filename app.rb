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



  end