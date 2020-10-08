class Trafiklabs

    # formats the data from the api 
    #
    # response -> 
    #   {
    #   "Departure" : [ {
    #     "Product" : {
    #       "name" : "Länstrafik - Buss Svart",
    #       "num" : "Svart",
    #       "catCode" : "7",
    #       "catOutS" : "BLT",
    #       "catOutL" : "Länstrafik - Buss",
    #       "operatorCode" : "279",
    #       "operator" : "Västtrafik",
    #       "operatorUrl" : "http://www.vasttrafik.se/"
    #     },
    #     "Stops" : {
    #       "Stop" : [ {
    #         "name" : "Sävedalen Vallhamra torg (Partille kn)",
    #         "id" : "740015681",
    #         "extId" : "740015681",
    #         "routeIdx" : 5,
    #         "lon" : 12.07129,
    #         "lat" : 57.720914,
    #         "depTime" : "12:32:00",
    #         "depDate" : "2020-10-08"
    #       },{
    #     "name" : "Backvägen (Göteborg kn)",
    #     "id" : "740068184",
    #     "extId" : "740068184",
    #     "routeIdx" : 6,
    #     "lon" : 12.059353,
    #     "lat" : 57.721345,
    #     "arrTime" : "12:35:00",
    #     "arrDate" : "2020-10-08"
    #   },...
    #
    #  => {name: "Svart", dep_time: "12:32:00", stops: [{name: "Backvägen (Göteborg kn)", id: "740068184", arr_time: "12:35:00"}, ...]}
    #
    # outp => [{name: "name", dep_time: time of departure from vallhamra, stops: [{name: name of stop, id: id of stop, arr_time: time of arrival to stop}, ...]}, ...]
    def self.format_with_stops(response)
        return response["Departure"].map {|buss| {name: buss["Product"]["num"], dep_time: buss["Stops"]["Stop"][0]["depTime"], stops: buss["Stops"]["Stop"][1..-1].map { |stop| {name: stop["name"], id: stop["id"], arr_time: stop["arrTime"]}}}}
    end

    #   onle contains the name and time of departure for each buss
    #   outp => [{name: "name", dep_time: dep_time}, ...]
    def self.format(response)
        return response["Departure"].map {|buss| {name: buss["Product"]["num"], dep_time: buss["Stops"]["Stop"][0]["depTime"]}}
    end

    # sends the api request and return n journeys formated with format(response)
    def self.get(max_journeys = 5, destination = 740015597)
        response = HTTParty.get("https://api.resrobot.se/v2/departureBoard?key=dc6277a9-744a-4bae-96b5-54bca1f84b88&id=740015681&direction=#{destination}&maxJourneys=#{max_journeys}&format=json")
        return format(response)
    end

end
