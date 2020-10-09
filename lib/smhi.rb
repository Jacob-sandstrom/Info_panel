class Smhi
    @@params_to_select = [
        "t",
        "Wsymb2",
        "wd",
        "ws",
        "gust"
    ]

    # change the time from utc to cest
    def self.update_time(response)

    end

    # example outp => [{:dateTime=>"2020-10-08T21:00:00Z", :params=>[{:name=>"t", :value=>[10.3]}, {:name=>"Wsymb2", :value=>[19]}]}, {:dateTime=>"2020-10-08T22:00:00Z", :params=>[{:name=>"t", :value=>[10.5]}, {:name=>"Wsymb2", :value=>[19]}]}]
    def self.format(response)
        response["timeSeries"].map {|time| {dateTime: time["validTime"], params: time["parameters"].select {|param| @@params_to_select.include?(param["name"])}.map {|param| {name: param["name"], value: param["values"]}}}}
    end

    def self.get()
        format HTTParty.get("https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/12.070948/lat/57.723424/data.json")
    end

end


