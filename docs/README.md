# Info panel

> Info panel is a webapp that displays basic information such as weather, buss departures, calendar and news articles in one place at all times. It is meant to be used on a screen at home to remove the need for opening multiple apps each morning.


## Docs

* To adapt this app for personal use you will need to modify the api requests in each self.get() function which resides in lib/* so that it matches your location/buss stop.

* You also need these keys in you .env file
> trafiklabs_key = YOUR_KEY

> reddit_client_id = YOUR_KEY

> reddit_client_secret = YOUR_KEY

* when connecting to google calendar via this app you will recieve a link in the terminal running your server. If you are using more than one account, make sure that you log in in the same order you specify which calendars to get in CalendarHandler.get_default_params()

### Deps

* ruby 
* bundler
* sinatra
* rake
* rerun
* slim
* httparty
* google-api-client