async function renderDataBoxes() {

    await renderBussDataBox()
    await renderWeatherDataBox()

    await renderData()
}

async function renderData() {
    renderBussData()
    renderWeatherData()

    startRefreshCountdown()
}

function clearData() {
    document.querySelector(".container").querySelectorAll('*:not(template)').forEach(n => n.remove());
}

function startRefreshCountdown() { setTimeout(function() { renderData() }, 1000 * 60 * 3) }

async function renderBussDataBox() {
    const response = await fetch(`http://localhost:9292/api/busses`)
    const result = await (response.json())

    const template = document.querySelector('#cardTemplate')
    const bussBox = template.content.cloneNode(true).querySelector('.card')
    bussBox.classList.add("bussBox")

    bussBox.querySelector(".card-title").innerHTML = "Bussar"
    busses = bussBox.querySelector(".card-content")

    for (const element of result) {
        const template = document.querySelector('#bussTemplate')
        const buss = template.content.cloneNode(true).querySelector('.buss')
        busses.appendChild(buss)
    }
    bussBox.appendChild(busses)
    document.querySelector(".container").appendChild(bussBox)
}

async function renderBussData() {
    const response = await fetch(`http://localhost:9292/api/busses`)
    const result = await (response.json())

    bussBox = document.querySelector(".bussBox")
    busses = bussBox.querySelectorAll(".buss")

    for (let i = 0; i < busses.length; i++) {
        buss = busses[i]
        values = result[i]
        buss.querySelector(".bussName").innerHTML = values.name
        buss.querySelector(".bussDepTime").innerHTML = values.dep_time
    }
}

async function renderWeatherDataBox() {
    const response = await fetch(`http://localhost:9292/api/weather`)
    const result = await (response.json())

    const template = document.querySelector('#weatherBoxTemplate')
    const weatherBox = template.content.cloneNode(true).querySelector('.card')
    weatherBox.classList.add("weatherBox")
    weatherBox.querySelector(".card-title").innerHTML = "Väder"

    day = result[1]
    for (let i = 0; i < result.length; i++) {
        const template = document.querySelector('#cardTemplate')
        const dayWeatherBox = template.content.cloneNode(true).querySelector('.card')
        dayWeatherBox.classList.add("dayWeather")

        if (i == 0) {
            dayWeatherBox.querySelector(".card-title").innerHTML = "idag"
        } else {
            dayWeatherBox.querySelector(".card-title").innerHTML = "imorgon"
        }

        dayWeather = dayWeatherBox.querySelector(".card-content")

        for (const element of day["times"]) {
            const template = document.querySelector('#weatherTemplate')
            const weather = template.content.cloneNode(true).querySelector('.weather')

            weather.classList.add("weather")
            weather.classList.add(`time_${element["dateTime"].slice(0, -3).replace(" ", "")}`)
            weather.setAttribute("time", element["dateTime"])



            dayWeather.appendChild(weather)
        }
        weatherBox.querySelector(".card-content").appendChild(dayWeatherBox)
    }
    container = document.querySelector(".container")
    container.appendChild(weatherBox)
}

async function renderWeatherData() {
    const response = await fetch(`http://localhost:9292/api/weather`)
    const result = await (response.json())

    weatherBox = document.querySelector(".weatherBox")
    dayWeatherBoxes = weatherBox.querySelectorAll(".dayWeather")

    for (let i = 0; i < dayWeatherBoxes.length; i++) {
        dayWeatherBox = dayWeatherBoxes[i]
        dayData = result[i]

        // dayWeatherBox.querySelector(".card-title").innerHTML = day["date"]
        dayWeather = dayWeatherBox.querySelector(".card-content")

        for (const element of dayData["times"]) {
            weather = dayWeather.querySelector(`.time_${element["dateTime"].slice(0, -3).replace(" ", "")}`)

            weather.querySelector(".time").innerHTML = element["dateTime"]
            weather.querySelector(".temperature").innerHTML = `${element["t"]}°C`
            weather.querySelector(".weatherSymbol").querySelector("img").src = `./img/weather/${element["Wsymb2"][0]}.svg`
            weather.querySelector(".windSpeed").innerHTML = `${element["ws"]} m/s`
            weather.querySelector(".gust").innerHTML = `(${element["gust"]})`
        }


    }
}