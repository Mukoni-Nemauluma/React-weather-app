import React, { useState, useEffect } from "react";
import axios from "axios";

const apiKey = "b2a5adcct04b33178913oc335f405433";

function formatDate(date) {
  let minutes = date.getMinutes();
  let hours = date.getHours();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${day} ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[date.getDay()];
}

function Weather() {
  const [city, setCity] = useState("Paris");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWeatherAndForecast = async () => {
      setIsLoading(true);
      try {
        const weatherUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
        const forecastUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;

        const [weatherResponse, forecastResponse] = await Promise.all([
          axios.get(weatherUrl),
          axios.get(forecastUrl),
        ]);

        setWeatherData(weatherResponse.data);
        setForecastData(forecastResponse.data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
      setIsLoading(false);
    };

    fetchWeatherAndForecast();
  }, [city]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setCity(event.target.elements.searchInput.value);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-900 via-purple-600 to-indigo-900 overflow-hidden">
      {isLoading ? (
        <div className="loading-spinner text-center text-white text-2xl animate-pulse">
          Loading...
        </div>
      ) : (
        <div className="weather-app bg-white bg-opacity-20 backdrop-blur-lg text-white p-6 md:p-8 max-w-screen-md mx-auto rounded-3xl shadow-2xl border border-gray-300">
          <header>
            <form
              className="search-form flex flex-col md:flex-row justify-center items-center mb-6 md:mb-8"
              id="search-form"
              onSubmit={handleSearchSubmit}
            >
              <input
                type="search"
                placeholder="Enter a city.."
                required
                id="search-form-input"
                className="search-form-input p-3 rounded-lg text-black mb-2 md:mb-0 md:mr-3 w-full md:w-auto shadow-md"
                name="searchInput"
              />
              <input
                type="submit"
                value="Search"
                className="search-form-button p-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition duration-300 w-full md:w-auto shadow-md"
              />
            </form>
          </header>
          <main>
            {weatherData && (
              <div className="weather-app-data bg-gradient-to-r from-indigo-700 to-indigo-500 p-5 md:p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
                <div>
                  <h1
                    className="weather-app-city text-4xl md:text-5xl font-extrabold mb-3 md:mb-4 text-white"
                    id="city"
                  >
                    {weatherData.city}
                  </h1>
                  <p className="weather-app-details text-base md:text-lg text-gray-100">
                    <span id="time">
                      {formatDate(new Date(weatherData.time * 1000))}
                    </span>
                    ,{" "}
                    <span id="description">
                      {weatherData.condition.description}
                    </span>
                    <br />
                    Humidity:{" "}
                    <strong id="humidity">
                      {weatherData.temperature.humidity}%
                    </strong>
                    , Wind:{" "}
                    <strong id="wind-speed">
                      {weatherData.wind.speed} km/h
                    </strong>
                  </p>
                </div>
                <div className="weather-app-temperature-container flex items-center mt-4">
                  <div id="icon">
                    <img
                      src={weatherData.condition.icon_url}
                      className="weather-app-icon w-20 h-20 md:w-28 md:h-28"
                      alt="Weather icon"
                    />
                  </div>
                  <div className="weather-app-temperature text-5xl md:text-6xl font-bold ml-4 text-blue-100">
                    {Math.round(weatherData.temperature.current)}
                  </div>
                  <div className="weather-app-unit text-2xl ml-2">°C</div>
                </div>
              </div>
            )}

            {forecastData && (
              <div className="weather-forecast mt-8">
                <h2 className="forecast-title text-2xl font-bold mb-4">
                  Weather Forecast
                </h2>
                <div
                  className="forecast-container grid grid-cols-2 md:grid-cols-6 gap-4"
                  id="forecast"
                >
                  {forecastData.daily.slice(1, 7).map((day, index) => (
                    <div
                      key={index}
                      className="weather-forecast-day bg-gradient-to-tr from-blue-500 to-blue-400 p-4 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300"
                    >
                      <div className="weather-forecast-date text-sm md:text-base text-white font-bold mb-2">
                        {formatDay(day.time)}
                      </div>
                      <img
                        src={day.condition.icon_url}
                        className="weather-forecast-icon w-12 h-12 md:w-16 md:h-16 mx-auto"
                        alt="Forecast icon"
                      />
                      <div className="weather-forecast-temperatures text-white text-sm md:text-base mt-2">
                        <div className="weather-forecast-temperature">
                          <strong>
                            {Math.round(day.temperature.maximum)}º
                          </strong>
                        </div>
                        <div className="weather-forecast-temperature">
                          {Math.round(day.temperature.minimum)}º
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
          <footer className="text-center mt-8 text-gray-200 text-sm md:text-base">
            This project was coded by{" "}
            <a
              href="https://github.com/Mukoni-Nemauluma"
              className="text-indigo-300 underline hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              Konanani Nemauluma
            </a>
            , is{" "}
            <a
              href="https://github.com/Mukoni-Nemauluma/React-weather-app"
              className="text-indigo-300 underline hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              open-sourced on GitHub
            </a>{" "}
            and{" "}
            <a
              href="https://globalweatherforecast.netlify.app/"
              className="text-indigo-300 underline hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              hosted on Netlify
            </a>
          </footer>
        </div>
      )}
    </div>
  );
}

export default Weather;
