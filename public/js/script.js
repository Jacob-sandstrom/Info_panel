async function renderData() {
    clearData()

    renderBussData()
    renderWeatherData()

    startRefreshCountdown()
}

function clearData() {
    document.querySelector(".container").querySelectorAll('*:not(template)').forEach(n => n.remove());
}

function startRefreshCountdown() { setTimeout(function() { renderData() }, 1000 * 60 * 3) }

async function renderBussData() {
    const response = await fetch(`http://localhost:9292/api/busses`)
    const result = await (response.json())

    const template = document.querySelector('#cardTemplate')
    const bussBox = template.content.cloneNode(true).querySelector('.card')


    bussBox.querySelector(".card-title").innerHTML = "Bussar"
    busses = bussBox.querySelector(".card-content")

    for (const element of result) {
        const template = document.querySelector('#bussTemplate')
        const buss = template.content.cloneNode(true).querySelector('.buss')

        buss.querySelector(".bussName").innerHTML = element.name
        buss.querySelector(".bussDepTime").innerHTML = element.dep_time

        busses.appendChild(buss)
    }
    bussBox.appendChild(busses)
    wrapper = document.querySelector(".container")
    wrapper.appendChild(bussBox)
}

async function renderWeatherData() {
    const response = await fetch(`http://localhost:9292/api/weather`)
    const result = await (response.json())

    const template = document.querySelector('#weatherBoxTemplate')
    const weatherBox = template.content.cloneNode(true).querySelector('.card')
    weatherBox.querySelector(".card-title").innerHTML = "Väder"
        // weatherBox = document.createElement("div")
        // weatherBox.classList.add("weatherBox", "box")
    for (const day of result) {

        const template = document.querySelector('#cardTemplate')
        const dayWeatherBox = template.content.cloneNode(true).querySelector('.card')

        dayWeatherBox.querySelector(".card-title").innerHTML = day["date"]
        dayWeather = dayWeatherBox.querySelector(".card-content")
            // dayWeather = document.createElement("div")
            // dayWeather.classList.add("dayWeather")

        // date = document.createElement("div")
        // date.classList.add("date")
        // date.innerHTML = day["date"]
        // dayWeather.appendChild(date)

        for (const element of day["times"]) {
            const template = document.querySelector('#weatherTemplate')
            const weather = template.content.cloneNode(true).querySelector('.weather')

            weather.querySelector(".time").innerHTML = element["dateTime"]
            weather.querySelector(".temperature").innerHTML = `${element["t"]}°C`
            weather.querySelector(".weatherSymbol").querySelector("img").src = `./img/weather/${element["Wsymb2"][0]}.svg`
                // weather.querySelector(".windDirection").src = `./img/arrow.svg`
                // weather.querySelector(".windDirection").style.transform = `rotate(${element["wd"] + 90}deg)`
            weather.querySelector(".windSpeed").innerHTML = `${element["ws"]} m/s`
            weather.querySelector(".gust").innerHTML = `(${element["gust"]})`

            dayWeather.appendChild(weather)
        }
        weatherBox.querySelector(".card-content").appendChild(dayWeatherBox)
    }
    wrapper = document.querySelector(".container")
        // wrapper.querySelector(".weatherBox").remove()
    wrapper.appendChild(weatherBox)
}