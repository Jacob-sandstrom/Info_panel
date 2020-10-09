async function renderData() {
    renderBussData()
    renderWeatherData()
}


async function renderBussData() {
    const response = await fetch(`http://localhost:9292/api/busses`);
    const result = await (response.json());

    bussBox = document.createElement("div")
    bussBox.classList.add("bussBox")
    for (const element of result) {
        const template = document.querySelector('#bussTemplate');
        const buss = template.content.cloneNode(true).querySelector('.buss');

        buss.querySelector(".bussName").innerHTML = element.name
        buss.querySelector(".bussDepTime").innerHTML = element.dep_time

        bussBox.appendChild(buss)
    }
    document.querySelector(".wrapper").appendChild(bussBox)
}

async function renderWeatherData() {
    const response = await fetch(`http://localhost:9292/api/weather`);
    const result = await (response.json());

    weatherBox = createElement("div")
    weatherBox.classList.add("weatherBox")
    for (const element of result) {
        const template = document.querySelector('#weatherTemplate');
        const weather = template.content.cloneNode(true).querySelector('.weather');

        weather.querySelector(".time").innerHTML = element["dateTime"]
        weather.querySelector(".temperature").innerHTML = element["params"]["t"]
        weather.querySelector(".weatherSymbol").innerHTML = element["params"]["Wsymb2"]
        weather.querySelector(".windDirection").innerHTML = element["params"]["wd"]
        weather.querySelector(".windSpeed").innerHTML = element["params"]["ws"]
        weather.querySelector(".gust").innerHTML = element["params"]["gust"]

        weatherBox.appendChild(weather)
    }
    document.querySelector(".wrapper").appendChild(bussBox)
}