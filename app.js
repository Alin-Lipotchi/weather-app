// Set Time

let timeNow = document.querySelector(".time-now");
let time = 0;

const setTime = () => {
    if (new Date().getMinutes() > 9) {
        time = `${new Date().getHours()}:${new Date().getMinutes()}`;
    } else {
        time = `${new Date().getHours()}:0${new Date().getMinutes()}`;
    }
    timeNow.innerHTML = time;
};

setInterval(setTime, 1000); // this keeps the time updated

// Drag to scroll

const list = document.querySelector(".weather-today");

let pos = { top: 0, left: 0, x: 0, y: 0 };

const mouseMoveHandler = (e) => {
    // How far the mouse has been moved
    const dx = e.clientX - pos.x;
    const dy = e.clientY - pos.y;

    // Scroll the element
    list.scrollTop = pos.top - dy;
    list.scrollLeft = pos.left - dx;
};

const mouseUpHandler = function () {
    document.removeEventListener("mousemove", mouseMoveHandler);
    document.removeEventListener("mouseup", mouseUpHandler);
    list.style.removeProperty("user-select");
};

const mouseDownHandler = (e) => {
    pos = {
        // The current scroll
        left: list.scrollLeft,
        top: list.scrollTop,
        // Get the current mouse position
        x: e.clientX,
        y: e.clientY,
    };

    list.style.userSelect = "none";
    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseUpHandler);
};

list.addEventListener("mousedown", mouseDownHandler);

list.scrollLeft = 52 * new Date().getHours(); // scroll to current hour

// Cities Lists

let cities = {
    clujNapoca: "latitude=46.77&longitude=23.60",
    bucharest: "latitude=44.43&longitude=26.10",
    berlin: "latitude=52.52&longitude=13.41",
    hannover: "latitude=53.17&longitude=8.51",
    paris: "latitude=48.85&longitude=2.35",
};

// Weather Status Code

let weatherCodeList = {
    0: [
        "Clear Sky",
        `class="fa-solid fa-sun" style="color: #e6fd93;"`,
        `class="fa-solid fa-moon" style="color: #e6fd93;"`,
    ],
    2: [
        "Partly Cloudy",
        `class="fa-solid fa-cloud-sun" style="color: #e6fd93;"`,
        `class="fa-solid fa-cloud-moon" style="color: #e6fd93;"`,
    ],
    3: ["Overcast", `class="fa-solid fa-cloud" style="color: #e6fd93;"`],
    45: ["Fog", `class="fa-solid fa-smog" style="color: #e6fd93;"`],
    51: ["Drizzle", `class="fa-solid fa-icicles" style="color: #e6fd93;"`],
    61: [
        "Rain",
        `class="fa-solid fa-cloud-sun-rain" style="color: #e6fd93;"`,
        `class="fa-solid fa-cloud-moon-rain" style="color: #e6fd93;"`,
    ],
    71: ["Snow", `class="fa-regular fa-snowflake" style="color: #e6fd93;"`],
    80: [
        "Showers",
        `class="fa-solid fa-cloud-showers-water" style="color: #e6fd93;"`,
    ],
    95: [
        "Thunderstorm",
        `class="fa-solid fa-cloud-bolt" style="color: #e6fd93;"`,
    ],
};

// Days of the week

const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

// Weather Function

let citySelector = document.querySelector(".city-selector");
let options = citySelector.querySelectorAll("option");

options.forEach((e) => {
    e.addEventListener("click", () => {
        if (e.index === 0) {
            updateData(cities.clujNapoca, "Cluj-Napoca");
        } else if (e.index === 1) {
            updateData(cities.bucharest, "Bucharest");
        } else if (e.index === 2) {
            updateData(cities.berlin, "berlin");
        } else if (e.index === 3) {
            updateData(cities.hannover, "hannover");
        } else if (e.index === 4) {
            updateData(cities.paris, "paris");
        }
    });
});

async function updateData(city, cityName) {
    fetch(
        `https://api.open-meteo.com/v1/forecast?${city}&hourly=temperature_2m,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min&forecast_days=7&timezone=auto`
    )
        .then((response) => response.json())
        .then((response) => {
            citySelectorUpdater(response, cityName);
        });
}

updateData(cities.clujNapoca, "Cluj-Napoca"); // default case/ execute on first run

// City updater function

const citySelectorUpdater = (e, cityName) => {
    // Main Section

    document.querySelector(".city-name").innerHTML = cityName;
    document.querySelector(".main-temp").innerHTML = Math.round(
        e.hourly.temperature_2m[new Date().getHours()]
    );
    document.querySelector(".hi-temp").innerHTML = Math.round(
        e.daily.temperature_2m_max[0]
    );
    document.querySelector(".lo-temp").innerHTML = Math.round(
        e.daily.temperature_2m_min[0]
    );

    // Hourly Section

    document.querySelector(".weather-today").innerHTML = ""; // Resets the weather

    // Background

    if (new Date().getHours() > 6 && new Date().getHours() < 19) {
        document.body.style.backgroundImage = `url("./backgrounds/day.jpg")`;
    } else {
        document.body.style.backgroundImage = `url("./backgrounds/night.jpg")`;
    }

    // Assigns the weather status icon depending on day or night
    let hourArr = e.hourly.temperature_2m.slice(0, 24);
    hourArr.forEach((el, idx) => {
        let weatherStatus = "";
        if (idx > 6 && idx < 19) {
            if (
                e.hourly.weathercode[idx] === 0 ||
                e.hourly.weathercode[idx] === 1
            ) {
                weatherStatus = weatherCodeList[0][1];
            } else if (e.hourly.weathercode[idx] === 2) {
                weatherStatus = weatherCodeList[2][1];
            } else if (e.hourly.weathercode[idx] === 3) {
                weatherStatus = weatherCodeList[3][1];
            } else if (
                e.hourly.weathercode[idx] >= 40 &&
                e.hourly.weathercode[idx] < 50
            ) {
                weatherStatus = weatherCodeList[45][1];
            } else if (
                e.hourly.weathercode[idx] >= 50 &&
                e.hourly.weathercode[idx] < 60
            ) {
                weatherStatus = weatherCodeList[51][1];
            } else if (
                e.hourly.weathercode[idx] >= 60 &&
                e.hourly.weathercode[idx] < 70
            ) {
                weatherStatus = weatherCodeList[61][1];
            } else if (
                e.hourly.weathercode[idx] >= 70 &&
                e.hourly.weathercode[idx] < 80
            ) {
                weatherStatus = weatherCodeList[71][1];
            } else if (
                e.hourly.weathercode[idx] >= 80 &&
                e.hourly.weathercode[idx] < 90
            ) {
                weatherStatus = weatherCodeList[80][1];
            } else if (
                e.hourly.weathercode[idx] >= 90 &&
                e.hourly.weathercode[idx] < 100
            ) {
                weatherStatus = weatherCodeList[95][1];
            }
        } else {
            if (
                e.hourly.weathercode[idx] === 0 ||
                e.hourly.weathercode[idx] === 1
            ) {
                weatherStatus = weatherCodeList[0][2];
            } else if (e.hourly.weathercode[idx] === 2) {
                weatherStatus = weatherCodeList[2][2];
            } else if (e.hourly.weathercode[idx] === 3) {
                weatherStatus = weatherCodeList[3][1];
            } else if (
                (e.hourly.weathercode[idx] >= 40) &
                (e.hourly.weathercode[idx] < 50)
            ) {
                weatherStatus = weatherCodeList[45][1];
            } else if (
                (e.hourly.weathercode[idx] >= 50) &
                (e.hourly.weathercode[idx] < 60)
            ) {
                weatherStatus = weatherCodeList[51][1];
            } else if (
                (e.hourly.weathercode[idx] >= 60) &
                (e.hourly.weathercode[idx] < 70)
            ) {
                weatherStatus = weatherCodeList[61][2];
            } else if (
                (e.hourly.weathercode[idx] >= 70) &
                (e.hourly.weathercode[idx] < 80)
            ) {
                weatherStatus = weatherCodeList[71][1];
            } else if (
                (e.hourly.weathercode[idx] >= 80) &
                (e.hourly.weathercode[idx] < 90)
            ) {
                weatherStatus = weatherCodeList[80][1];
            } else if (
                (e.hourly.weathercode[idx] >= 90) &
                (e.hourly.weathercode[idx] < 100)
            ) {
                weatherStatus = weatherCodeList[95][1];
            }
        }

        // Auto-generate the hourly section

        document.querySelector(
            ".weather-today"
        ).innerHTML += `<div class="weather-box vertical">
                <span class="hour">${
                    idx > 9 ? idx : "0" + idx.toString()
                }</span>
                <i ${weatherStatus}></i>
                <span class="hourly-weather">${Math.round(el)}&#176;</span>
            </div>`;
    });

    // Daily Section

    document.querySelector(
        ".weather-weekly"
    ).innerHTML = `<h3><i class="fa-regular fa-calendar"></i> 7 days forecast</h3>`; // Reset

    e.daily.time.forEach((el, idx) => {
        let weatherStatus = "";
        if (e.daily.weathercode[idx] === 0 || e.daily.weathercode[idx] === 1) {
            weatherStatus = weatherCodeList[0][1];
        } else if (e.daily.weathercode[idx] === 2) {
            weatherStatus = weatherCodeList[2][1];
        } else if (e.daily.weathercode[idx] === 3) {
            weatherStatus = weatherCodeList[3][1];
        } else if (
            (e.daily.weathercode[idx] >= 40) &
            (e.daily.weathercode[idx] < 50)
        ) {
            weatherStatus = weatherCodeList[45][1];
        } else if (
            (e.daily.weathercode[idx] >= 50) &
            (e.daily.weathercode[idx] < 60)
        ) {
            weatherStatus = weatherCodeList[51][1];
        } else if (
            (e.daily.weathercode[idx] >= 60) &
            (e.daily.weathercode[idx] < 70)
        ) {
            weatherStatus = weatherCodeList[61][1];
        } else if (
            (e.daily.weathercode[idx] >= 70) &
            (e.daily.weathercode[idx] < 80)
        ) {
            weatherStatus = weatherCodeList[71][1];
        } else if (
            (e.daily.weathercode[idx] >= 80) &
            (e.daily.weathercode[idx] < 90)
        ) {
            weatherStatus = weatherCodeList[80][1];
        } else if (
            (e.daily.weathercode[idx] >= 90) &
            (e.daily.weathercode[idx] < 100)
        ) {
            weatherStatus = weatherCodeList[95][1];
        }

        // The function that auto-generates the list

        document.querySelector(
            ".weather-weekly"
        ).innerHTML += `<div class="weather-box horizontal">
                <span class="day">${weekday[new Date(el).getDay()].slice(
                    0,
                    3
                )}</span>
                <i ${weatherStatus}></i>
                <span class="daily-lo-weather">L: ${Math.round(
                    e.daily.temperature_2m_min[idx]
                )}&#176;</span>
                <div class="div-line"></div>
                <span class="daily-hi-weather">H: ${Math.round(
                    e.daily.temperature_2m_max[idx]
                )}&#176;</span>
            </div>`;
    });
};
