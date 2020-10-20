require "google/apis/calendar_v3"
require "googleauth"
require "googleauth/stores/file_token_store"
require "date"
require "fileutils"


class Calendar
    def initialize(account)
        # The file token.yaml stores the user's access and refresh tokens, and is
        # created automatically when the authorization flow completes for the first
        # time.
        @token_path = "google/token_#{account}.yaml".freeze
        
        init_api()
    end
    
    CREDENTIALS_PATH = "google/credentials.json".freeze
    OOB_URI = "urn:ietf:wg:oauth:2.0:oob".freeze
    APPLICATION_NAME = "Google Calendar API Ruby Quickstart".freeze
    SCOPE = Google::Apis::CalendarV3::AUTH_CALENDAR_READONLY
    

    # Ensure valid credentials, either by restoring from the saved credentials
    # files or intitiating an OAuth2 authorization. If authorization is required,
    # the user's default browser will be launched to approve the request.
    #
    # @return [Google::Auth::UserRefreshCredentials] OAuth2 credentials
    def authorize
        client_id = Google::Auth::ClientId.from_file CREDENTIALS_PATH
        token_store = Google::Auth::Stores::FileTokenStore.new file: @token_path
        authorizer = Google::Auth::UserAuthorizer.new client_id, SCOPE, token_store
        user_id = "default"
        credentials = authorizer.get_credentials user_id
        if credentials.nil?
            url = authorizer.get_authorization_url base_url: OOB_URI
            puts "Open the following URL in the browser and enter the " \
                "resulting code after authorization:\n" + url
            code = gets
            credentials = authorizer.get_and_store_credentials_from_code(
            user_id: user_id, code: code, base_url: OOB_URI
            )
        end
        credentials
    end

    # Initialize the API
    def init_api
        @service = Google::Apis::CalendarV3::CalendarService.new
        @service.client_options.application_name = APPLICATION_NAME
        @service.authorization = authorize
    end



    #   get start and end time
    def start_end_date(num_days)
        date_time = DateTime.now
        day = date_time.day
        month = date_time.month
        year = date_time.year

        start_date = DateTime.new(year, month, day)
        end_date = start_date + num_days
        [start_date, end_date]
    end


    #   send request
    def get_events(calendar_id = "primary", num_days = 5)
        start_date, end_date = start_end_date(num_days)

        response = @service.list_events(calendar_id,
                                    max_results:   1000,
                                    single_events: true,
                                    order_by:      "startTime",
                                    time_min:      start_date.rfc3339,
                                    time_max:      end_date.rfc3339
                                    )

        # puts "Upcoming events:"
        # puts "No upcoming events found" if response.items.empty?
        # response.items.each do |event|
        #     start = event.start.date || event.start.date_time
        #     puts "- #{event.summary} (#{start})"
        # end
        
        return response
    end

end


class CalendarHandler

    #   updates the time of an event to be CEST
    def self.update_time(event)
        if event.start.date == nil
            event.start.date_time = event.start.date_time.new_offset('+02:00')
            event.end.date_time = event.end.date_time.new_offset('+02:00')
        else
            # event.start.date = event.start.date.new_offset('+02:00')
            # event.end.date = event.end.date.new_offset('+02:00')
        end
        return event
    end
    
    def self.sort_events(events)
        events.sort_by {|event| event.start.date == nil ? event.start.date_time : event.start.date}
    end

    def self.merge_calendars(calendars)
        events = []
        calendars.each do |calendar|
            calendar.items.each {|event| events << update_time(event) }
        end
        events
    end

    def self.print(events)
        puts "Upcoming events:"
        events.each do |event|
            start = event.start.date || event.start.date_time
            puts "- #{event.summary} (#{start})"
        end
    end

    def self.format(events, days)
        events = events.map {|event| {summary: event.summary, start_time: event.start.date_time || event.start.date, end_time: event.end.date_time || event.end}}
        # days.each {|day| day[:events] = events.select {|event| day[:date] == event[:start_time].strftime("%Y-%m-%d")}}
        events.each do
            
        end
    end

    def self.create_event_box(num_days)
        days = []
        num_days.times do |i|
            time = Time.now + (60*60*24*i)
            days << {date: time.strftime("%Y-%m-%d"), events: []}
        end
        days
    end

    def self.get(calendars_to_get = {jojac: ["primary"], te4: ["ga.ntig.se_classroom871f8384@group.calendar.google.com"]}, num_days = 5)
        calendars = []
        calendars_to_get.keys.each do |c| 
            calendars_to_get[c].each { |id| calendars << Calendar.new(c.to_s).get_events(id, num_days) } 
        end
        days = create_event_box(num_days)
        events = merge_calendars(calendars)
        events = sort_events(events)
        events = format(events, days)
        # p events[0]
        
        events
    end
end
