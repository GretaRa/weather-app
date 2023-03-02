import "./styles.css"

let url = 'https://api.openweathermap.org/data/2.5/weather?q=Klaipeda&appid=55d93e41723e0921f44187affba5a537&units=metric';
async function getWeather (){
  let response = await fetch(url, {mode:"cors"});
  let weatherData = await response.json();
  console.log(weatherData);
  console.log(weatherData.weather[0].icon);

  const tempNow = document.getElementById('temperature');
  tempNow.textContent = Math.round(weatherData.main.temp) + '°C';

  const weatherNowDesc = document.getElementById('description');
  weatherNowDesc.textContent = weatherData.weather[0].main;

  const headerCity = document.getElementById('header-city');
  headerCity.textContent = 'Weather Today in' + " " + weatherData.name;

  const weatherNowIcon = document.getElementById('weather-icon');
  weatherNowIcon.src = 'http://openweathermap.org/img/wn/' + weatherData.weather[0].icon + '@2x.png'
}

getWeather();


