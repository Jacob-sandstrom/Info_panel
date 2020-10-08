async function renderData() {
    renderBussData()
}


async function renderBussData() {

    const response = await fetch(`http://localhost:9292/api/busses`);
    const result = await (response.json());

    // console.log(result)
    bussBox = document.createElement("div")
    bussBox.classList.add("bussBox")
    for (const element of result) {

        bussName = document.createElement("div")
        bussName.classList.add("bussName")
        bussName.innerHTML = element.name

        bussDepTime = document.createElement("div")
        bussDepTime.classList.add("bussDepTime")
        bussDepTime.innerHTML = element.dep_time


        buss = document.createElement("article")
        buss.classList.add("buss")

        buss.appendChild(bussName)
        buss.appendChild(bussDepTime)

        bussBox.appendChild(buss)

    }
    document.querySelector(".wrapper").appendChild(bussBox)

}

async function renderWeatherData() {
    const response = await fetch(`http://localhost:9292/api/weather`);
    const result = await (response.json());


}