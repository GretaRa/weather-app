import "./styles.css"

let url = 'https://api.openweathermap.org/data/2.5/weather?q=Arnhem&appid=55d93e41723e0921f44187affba5a537';
async function getWeather (){
  let response = await fetch(url, {mode:"cors"});
  let weatherData = await response.json();
  console.log(weatherData);
  console.log(weatherData.main);
  
}

getWeather();

