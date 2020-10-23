const refreshTime = 3

async function renderDataBoxes() {

    await renderBussDataBox()
    await renderWeatherDataBox()
    await renderCalendarDataBox()

    await renderData()
}

async function renderData() {
    renderBussData()
    renderWeatherData()
    renderCalendarData()

    startRefreshCountdown()
}

function clearData() {
    document.querySelector(".dataContainer").querySelectorAll('*:not(template)').forEach(n => n.remove());
}

function startRefreshCountdown() { setTimeout(function() { renderData() }, 1000 * 60 * refreshTime) }

async function renderBussDataBox() {
    const response = await fetch(`http://localhost:9292/api/busses`)
    const result = await (response.json())

    const template = document.querySelector('#bussBoxTemplate')
    const bussBox = template.content.cloneNode(true).querySelector('.card')
        // bussBox.classList.add("bussBox")

    busses = bussBox.querySelector(".card-content")

    for (const element of result) {
        const template = document.querySelector('#bussTemplate')
        const buss = template.content.cloneNode(true).querySelector('.buss')
        busses.appendChild(buss)
    }
    bussBox.appendChild(busses)
    document.querySelector(".dataContainer").appendChild(bussBox)
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
        // weatherBox.classList.add("weatherBox")

    day = result[1]
    for (let i = 0; i < result.length; i++) {
        const template = document.querySelector('#weatherCardTemplate')
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
        weatherBox.querySelector(".row").appendChild(dayWeatherBox)
    }
    container = document.querySelector(".dataContainer")
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

async function renderCalendarDataBox() {
    const template = document.querySelector('#calendarBoxTemplate')
    const calendarBox = template.content.cloneNode(true).querySelector('.card')

    container = document.querySelector(".dataContainer")
    container.appendChild(calendarBox)
}

async function renderCalendarDates(calendarGrid, numDays, weekDays) {
    currentDate = new Date()
    for (let i = 0; i < numDays; i++) {
        day = currentDate.getDay()
        date = currentDate.getDate()

        dateHeader = document.createElement("div")
        dateHeader.classList.add("dateHeader", "center-align")
        dateHeader.innerHTML = `${date} ${weekDays[day]}`
        calendarGrid.appendChild(dateHeader)

        currentDate.setDate(currentDate.getDate() + 1)
    }

    divider = document.createElement("div")
    divider.classList.add("divider")
    calendarGrid.appendChild(divider)
}

//  adds start grid column and number of columns to span to the params of the event
function getStartAndSpan(event, numDays) {
    let months = []
    currentDate = new Date()

    for (let i = 1; i <= numDays; i++) {
        date = currentDate.getDate()
        month = currentDate.getMonth() + 1
        year = currentDate.getFullYear()
        dateString = `${year}-${month}-${date}`

        console.log(currentDate.getTime())
        console.log(Date.parse(event["start_time"]))

        if (dateString == event["start_time"].slice(0, 10) || (currentDate.getTime() > Date.parse(event["start_time"]) && i == 1)) { event["start_column"] = i }

        // if (end_time.length == 10 || time == 00:00)
        if (dateString == event["end_time"].slice(0, 10)) {
            if (event["end_time"].length == 10 || event["end_time"].slice(11, 16) == "00:00") {
                event["span_column"] = i - event["start_column"]
            } else {
                event["span_column"] = i - event["start_column"] + 1
            }
        } else if (currentDate.getTime() < Date.parse(event["end_time"]) && i == numDays) {
            event["span_column"] = i - event["start_column"] + 1
        }

        currentDate.setDate(currentDate.getDate() + 1)
    }
    return event
}

function createEventBox(event) {
    const template = document.querySelector('#eventBoxTemplate')
    const eventBox = template.content.cloneNode(true).querySelector('.eventBox')

    eventBox.classList.add(`start${event["start_column"]}`)
    eventBox.classList.add(`span${event["span_column"]}`)

    eventBox.querySelector(".summary").innerHTML = event["summary"]

    if (event["start_time"].length > 10) {
        eventBox.querySelector(".time").innerHTML = `${event["start_time"].slice(11, 16)} - ${event["end_time"].slice(11, 16)}`
    } else {
        // eventBox.querySelector(".time").innerHTML = "hela dagen"
    }
    return eventBox
}

async function renderCalendarData() {
    let weekDays = ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"]
    let numDays = 7
    const response = await fetch(`http://localhost:9292/api/calendar/${numDays}`)
    const result = await (response.json())

    calendar = document.querySelector(".calendarBox")

    calendarGrid = calendar.querySelector(".calendarGrid")
    calendarGrid.innerHTML = ""
    renderCalendarDates(calendarGrid, numDays, weekDays)


    for (let event of result) {
        // console.log(event)
        event = getStartAndSpan(event, numDays)
        console.log(event)

        eventBox = createEventBox(event)

        calendarGrid.appendChild(eventBox)
    }


}