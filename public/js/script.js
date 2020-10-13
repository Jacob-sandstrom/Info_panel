async function renderData() {
    clearData()

    renderBussData()
    renderWeatherData()

    startRefreshCountdown()
}

function clearData() {
    document.querySelector(".wrapper").querySelectorAll('*:not(template)').forEach(n => n.remove());
}

function startRefreshCountdown() { setTimeout(function() { renderData() }, 1000 * 60 * 3) }

async function renderBussData() {
    const response = await fetch(`http://localhost:9292/api/busses`)
    const result = await (response.json())

    bussBox = document.createElement("div")
    bussBox.classList.add("bussBox", "box")

    bussHeader = document.createElement("div")
    bussHeader.classList.add("bussHeader")
    bussHeader.innerHTML = "Bussar"
    bussBox.appendChild(bussHeader)

    busses = document.createElement("div")
    busses.classList.add("busses")

    for (const element of result) {
        const template = document.querySelector('#bussTemplate')
        const buss = template.content.cloneNode(true).querySelector('.buss')

        buss.querySelector(".bussName").innerHTML = element.name
        buss.querySelector(".bussDepTime").innerHTML = element.dep_time

        busses.appendChild(buss)
    }
    bussBox.appendChild(busses)
    wrapper = document.querySelector(".wrapper")
    wrapper.appendChild(bussBox)
}

async function renderWeatherData() {
    const response = await fetch(`http://localhost:9292/api/weather`)
    const result = await (response.json())

    weatherBox = document.createElement("div")
    weatherBox.classList.add("weatherBox", "box")
    for (const day of result) {

        dayWeather = document.createElement("div")
        dayWeather.classList.add("dayWeather")

        date = document.createElement("div")
        date.classList.add("date")
        date.innerHTML = day["date"]
        dayWeather.appendChild(date)

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
        weatherBox.appendChild(dayWeather)
    }
    wrapper = document.querySelector(".wrapper")
        // wrapper.querySelector(".weatherBox").remove()
    wrapper.appendChild(weatherBox)
}