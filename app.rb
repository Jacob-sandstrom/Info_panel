class Server < Sinatra::Base
    get '/' do
        slim :index
      
    end

    
    get '/api/busses' do
        # content_type :json
        return Trafiklabs.get(5).to_json
    end



  end