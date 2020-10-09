class Smhi
    @@params_to_select = [
        "t",
        "Wsymb2",
        # "wd",
        "ws",
        "gust"
    ]

    # change the time from utc to cest
    def self.update_time(response)
        response.each do |date_time|
            temp = date_time[:dateTime].split("T")
            date = temp[0].split("-")
            time = temp[1][0..-2].split(":")
            dt = date.concat(time).map {|e| e.to_i}

            date_time[:dateTime] = Time.new(dt[0], dt[1], dt[2], dt[3], dt[4]) + 3600 * 2
        end
    end
    
    def self.sort_into_days(response)
        # time.strftime("%Y-%m-%d")        # "2015-12-05"
        # time.strftime("%k:%M")           # "17:48"
        days = []
        dates = response.map {|date_time| date_time[:dateTime].strftime("%Y-%m-%d")}.uniq
        dates.each do |date|
            temp = {date: date, times: response.clone.map(&:clone).select {|x| x[:dateTime].strftime("%Y-%m-%d") == date}}
            temp[:times].each {|x| x[:dateTime] = x[:dateTime].strftime("%k:%M") }
            days << temp
            # days[date] = response.clone.map(&:clone).select {|x| x[:dateTime].strftime("%Y-%m-%d") == date}
            # days[date].each {|x| x[:dateTime] = x[:dateTime].strftime("%k:%M") }
        end
        days
    end

    def self.to_hash(hash_array)
        hash = {}
        hash_array.each {|h| hash[h.keys[0]] = h[h.keys[0]]}
        hash
    end

    # example outp => [{:dateTime=>"2020-10-08T21:00:00Z", :params=>{"t"=>[10.3]}, {"Wsymb2"=>[19]}]}, {:dateTime=>"2020-10-08T22:00:00Z", :params=>[{"t"=>[10.5]}, {"Wsymb2"=>[19]}}]
    def self.format(response)
        resp = response["timeSeries"].map {|time| {dateTime: time["validTime"], params: to_hash(time["parameters"].select {|param| @@params_to_select.include?(param["name"])}.map {|param| {"#{param['name']}": param["values"]}})}}
        
        temp = []
        resp.each do |weather|
            x = {dateTime: weather[:dateTime]}
            weather[:params].keys.each {|param| x[param] = weather[:params][param] }
            temp << x
        end

        temp = update_time(temp)
        temp = sort_into_days(temp)



        temp

    end

    def self.get()
        format HTTParty.get("https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/12.070948/lat/57.723424/data.json")
    end

end


