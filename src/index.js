import "./styles.css";
import { format } from "date-fns";


getForecast('London');

const forecast = document.querySelector('#forecast');
const form = document.getElementById('search-form');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  forecast.innerHTML = '';
  let city = document.getElementById('city-input').value;
	//Capitalize first letter and lowercase the rest of the string
	city = city[0].toUpperCase() + city.slice(1).toLowerCase();
  getForecast(city);
});

async function getForecast(city) {
	let url =
		`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=55d93e41723e0921f44187affba5a537&units=metric`;
	let response = await fetch(url, { mode: "cors" });
	let forecastData = await response.json();
	let daily = [];

	for (var i = 0; i < forecastData.list.length; i += 8) {
		daily.push(forecastData.list[i]);
	}	
  
  const headerCity = document.getElementById("header-city");
	headerCity.textContent = `Weather in ${city}`;

  //Create todays weather display
  function displayTodayWeather() {
    const weatherNowIcon = document.getElementById("weather-icon");
    weatherNowIcon.src =
      "http://openweathermap.org/img/wn/" +
      daily[0].weather[0].icon +
      "@2x.png";

    const weatherDay = document.querySelector("#day");
    weatherDay.textContent = format(new Date(daily[0].dt_txt), "eeee");

    const tempNow = document.getElementById("temperature");
    tempNow.textContent = Math.round(daily[0].main.temp_max) + "°C";

    const weatherNowDesc = document.getElementById("description");
    weatherNowDesc.textContent = daily[0].weather[0].main;
  }
  
  //Create next 4 days weather display
	function displayForecast() {
		for (let d = 1; d < daily.length; d++) {
			const forecastItem = document.createElement("div");
			forecastItem.classList.add("forecast-item");

			const iconDiv = document.createElement("div");
			const forecastIcon = document.createElement("img");
			forecastIcon.setAttribute("id", "weather-icon");
			forecastIcon.setAttribute(
				"src",
				"http://openweathermap.org/img/wn/" +
					daily[d].weather[0].icon +
					"@2x.png"
			);

			const forecastDay = document.createElement("div");
			forecastDay.classList.add("forecast-day");
			forecastDay.textContent = format(new Date(daily[d].dt_txt), "eeee");

			const forecastHigh = document.createElement("div");
			forecastHigh.classList.add("forecast-high");
			forecastHigh.textContent = Math.round(daily[d].main.temp_max) + "°C";

			const forecastLow = document.createElement("div");
			forecastLow.classList.add("forecast-low");
			forecastLow.textContent = Math.round(daily[d].main.temp_min) + "°C";

			document.getElementById("forecast").appendChild(forecastItem);
			forecastItem.appendChild(iconDiv);
			iconDiv.appendChild(forecastIcon);
			forecastItem.appendChild(forecastDay);
			forecastItem.appendChild(forecastHigh);
			forecastItem.appendChild(forecastLow);
		}
	}
  displayTodayWeather()
	displayForecast();
}

