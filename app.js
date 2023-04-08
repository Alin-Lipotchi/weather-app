// Variables

let timeNow = document.querySelector(".time-now");

// Set Time

let time = 0;

const setTime = () => {
    if (new Date().getMinutes() > 9) {
        time = `${new Date().getHours()}:${new Date().getMinutes()}`;
    } else {
        time = `${new Date().getHours()}:0${new Date().getMinutes()}`;
    }
    timeNow.innerHTML = time;
};

setInterval(setTime, 1000);

//

fetch(
    "https://api.open-meteo.com/v1/forecast?latitude=46.77&longitude=23.60&hourly=temperature_2m,precipitation_probability,precipitation&daily=temperature_2m_max,temperature_2m_min&forecast_days=1&timezone=auto"
)
    .then((response) => response.json())
    .then((response) => console.log(response));
