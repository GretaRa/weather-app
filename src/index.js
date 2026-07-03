import "./styles.css";
import { format } from "date-fns";
import clearDay from "@meteocons/svg/fill/clear-day.svg";
import clearNight from "@meteocons/svg/fill/clear-night.svg";
import partlyCloudyDay from "@meteocons/svg/fill/partly-cloudy-day.svg";
import partlyCloudyNight from "@meteocons/svg/fill/partly-cloudy-night.svg";
import cloudy from "@meteocons/svg/fill/cloudy.svg";
import overcast from "@meteocons/svg/fill/overcast.svg";
import drizzle from "@meteocons/svg/fill/drizzle.svg";
import rainDay from "@meteocons/svg/fill/partly-cloudy-day-rain.svg";
import rainNight from "@meteocons/svg/fill/partly-cloudy-night-rain.svg";
import thunderDay from "@meteocons/svg/fill/thunderstorms-day.svg";
import thunderNight from "@meteocons/svg/fill/thunderstorms-night.svg";
import snow from "@meteocons/svg/fill/snow.svg";
import fog from "@meteocons/svg/fill/fog.svg";
import notAvailable from "@meteocons/svg/fill/not-available.svg";

const iconMap = {
	"01d": clearDay,
	"01n": clearNight,
	"02d": partlyCloudyDay,
	"02n": partlyCloudyNight,
	"03d": cloudy,
	"03n": cloudy,
	"04d": overcast,
	"04n": overcast,
	"09d": drizzle,
	"09n": drizzle,
	"10d": rainDay,
	"10n": rainNight,
	"11d": thunderDay,
	"11n": thunderNight,
	"13d": snow,
	"13n": snow,
	"50d": fog,
	"50n": fog,
};

function getIconSrc(owmCode) {
	return iconMap[owmCode] || notAvailable;
}

getLocationName("Amsterdam");
getSearchInput();

function getSearchInput() {
	const form = document.getElementById("search-form");

	form.addEventListener("submit", (event) => {
		event.preventDefault();

		let cityInput = document.getElementById("city-input").value;
		let cityInputField = document.getElementById("city-input");
		cityInputField.value = "";

		getLocationName(cityInput);
	});
}

function getCity(city, country) {
	const forecast = document.querySelector("#forecast");
	forecast.innerHTML = "";
	//Set city name in the header
	const headerCity = document.getElementById("header-city");
	headerCity.textContent = `Weather in ${city}, ${country}`;
}

function resetDisplay() {
	const weatherContainer = document.getElementById("weather");
	weatherContainer.style.display = "flex";

	const errorContainer = document.querySelector(".errorContainer");
	errorContainer.style.display = "none";
}

async function getLocationName(cityInput) {
	try {
		let url = `https://api.openweathermap.org/geo/1.0/direct?q=${cityInput}&limit=3&appid=55d93e41723e0921f44187affba5a537`;
		let response = await fetch(url, { mode: "cors" });
		let locationData = await response.json();
		let lat = locationData[0].lat;
		let lon = locationData[0].lon;
		getForecast(lat, lon);
	} catch (error) {
		const weatherContainer = document.getElementById("weather");
		weatherContainer.style.display = "none";

		const errorContainer = document.querySelector(".errorContainer");
		errorContainer.style.display = "block";

		const errMsg = document.querySelector(".errorMsg");
		errMsg.textContent = `No data found`;

		throw new Error("Request failed due to wrong search input.");
	}
}

async function getForecast(lat, lon) {
	try {
		let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=55d93e41723e0921f44187affba5a537&units=metric`;
		let response = await fetch(url, { mode: "cors" });
		if (!response.ok) {
			const weatherContainer = document.getElementById("weather");
			weatherContainer.style.display = "none";

			const errorContainer = document.querySelector(".errorContainer");
			errorContainer.style.display = "block";

			const errMsg = document.querySelector(".errorMsg");
			errMsg.textContent = `No data found`;

			throw new Error("Request failed due to wrong search input.");
		} else {
			let forecastData = await response.json();
			let city = forecastData.city.name;
			let country = forecastData.city.country;
			getCity(city, country);
			selectDaily(forecastData);
			resetDisplay();
		}
	} catch (error) {
		console.log(error);
	}
}

function selectDaily(forecastData) {
	let daily = [];

	for (var i = 0; i < forecastData.list.length; i += 8) {
		daily.push(forecastData.list[i]);
	}
	displayTodayWeather(daily);
	displayForecast(daily);
}

//Create todays weather display
function displayTodayWeather(daily) {
	const weatherNowIcon = document.getElementById("weather-icon");
	weatherNowIcon.src = getIconSrc(daily[0].weather[0].icon);

	const weatherDay = document.querySelector("#day");
	weatherDay.textContent = format(new Date(daily[0].dt_txt), "eeee");

	const tempNow = document.getElementById("temperature");
	tempNow.textContent = Math.round(daily[0].main.temp_max) + "°C";

	const weatherNowDesc = document.getElementById("description");
	weatherNowDesc.textContent = daily[0].weather[0].main;
}

const currentLocationBtn = document.getElementById("current-location-btn");
currentLocationBtn.addEventListener("click", getCurrentLocation);

function getCurrentLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition((position) => {
			let lat = position.coords.latitude;
			let lon = position.coords.longitude;
			getForecast(lat, lon);
		});
	} else {
		console.log("Geolocation is not supported by this browser.");
	}
}

//Create next 4 days weather display
function displayForecast(daily) {
	for (let d = 1; d < daily.length; d++) {
		const forecastItem = document.createElement("div");
		forecastItem.classList.add("forecast-item");

		const iconDiv = document.createElement("div");
		const forecastIcon = document.createElement("img");
		forecastIcon.setAttribute("id", "weather-icon");
		forecastIcon.setAttribute("src", getIconSrc(daily[d].weather[0].icon));
		forecastIcon.setAttribute("aria-hidden", "true");

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
