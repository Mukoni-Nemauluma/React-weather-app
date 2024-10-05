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
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchWeatherAndForecast = async () => {
      setIsLoading(true); // Set loading to true when fetching begins
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
      setIsLoading(false); // Set loading to false when fetching is complete
    };

    fetchWeatherAndForecast();
  }, [city]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setCity(event.target.elements.searchInput.value);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-purple-400 via-blue-500 to-indigo-800">
      {isLoading ? (
        <div className="loading-spinner text-center text-white text-xl">
          Loading...
        </div>
      ) : (
        <div className="weather-app bg-white bg-opacity-10 backdrop-blur-lg text-white p-8 max-w-screen-md mx-auto rounded-3xl shadow-2xl border border-gray-300">
          <header>
            <form
              className="search-form flex justify-center items-center mb-8"
              id="search-form"
              onSubmit={handleSearchSubmit}
            >
              <input
                type="search"
                placeholder="Enter a city.."
                required
                id="search-form-input"
                className="search-form-input p-2 rounded-lg text-black mr-2"
                name="searchInput"
              />
              <input
                type="submit"
                value="Search"
                className="search-form-button p-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition duration-300"
              />
            </form>
          </header>
          <main>
            {weatherData && (
              <div className="weather-app-data bg-indigo-600 bg-opacity-50 p-6 rounded-xl shadow-md">
                <div>
                  <h1
                    className="weather-app-city text-4xl font-bold mb-4 text-white"
                    id="city"
                  >
                    {weatherData.city}
                  </h1>
                  <p className="weather-app-details text-lg text-gray-200">
                    <span id="time">
                      {formatDate(new Date(weatherData.time * 1000))}
                    </span>
                    ,
                    <span id="description">
                      {" "}
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
                      className="weather-app-icon w-24 h-24"
                      alt="Weather icon"
                    />
                  </div>
                  <div className="weather-app-temperature text-6xl font-bold ml-4 text-blue-200">
                    {Math.round(weatherData.temperature.current)}
                  </div>
                  <div className="weather-app-unit text-2xl ml-2">°C</div>
                </div>
              </div>
            )}

            {forecastData && (
              <div
                className="weather-forecast mt-8 grid grid-cols-5 gap-2"
                id="forecast"
              >
                {forecastData.daily.slice(0, 5).map((day, index) => (
                  <div key={index} className="weather-forecast-day">
                    <div className="weather-forecast-date">
                      {formatDay(day.time)}
                    </div>
                    <img
                      src={day.condition.icon_url}
                      className="weather-forecast-icon"
                      alt="Forecast icon"
                    />
                    <div className="weather-forecast-temperatures">
                      <div className="weather-forecast-temperature">
                        <strong>{Math.round(day.temperature.maximum)}º</strong>
                      </div>
                      <div className="weather-forecast-temperature">
                        {Math.round(day.temperature.minimum)}º
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
          <footer className="text-center mt-8 text-gray-300">
            This project was coded by{" "}
            <a
              href="https://github.com/Mukoni-Nemauluma"
              className="text-blue-300 underline hover:text-white"
              target="_blank"
            >
              Konanani Nemauluma
            </a>
            , is{" "}
            <a
              href="#"
              className="text-blue-300 underline hover:text-white"
              target="_blank"
            >
              open-sourced on GitHub
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="text-blue-300 underline hover:text-white"
              target="_blank"
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
