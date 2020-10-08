class Server < Sinatra::Base
    get '/' do
        slim :index
      
    end

    
    get '/api/busses' do
        @busses = Trafiklabs.get(5)

        slim :index
    end



  end