import React, { useState, useEffect } from 'react'
import axios from 'axios';

function App() {
  const [ countries, setCountries] = useState([])
  const [ countryFilter, setCountryFilter ] = useState('')
  const [ showWeather, setShowWeather ] = useState(false)
  const [ weatherData, setWeatherData ] = useState({})
  const weatherApiKey = "dc6864aadbf1a62fade2fe4fa7f5daa8"

  const handleCountryFilterChange = (event) => {
    setCountryFilter(event.target.value)
  }

  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])
  // Weather
  useEffect(() => {
    console.log("effect weather:", showWeather, weatherApiKey, countryFilter)
    if (showWeather) {
      axios
      .get('http://api.weatherstack.com/current?access_key='+weatherApiKey+'&query='+countryFilter)
      .then(response => {
        console.log("weather response received", response.data)
        setWeatherData(response.data)
      })
    }
  }, [showWeather])

  function renderWeather() {
    if (weatherData.location === undefined) {
      return (
        <p>Could not get weather data.</p>
      )
    }
    const loc = weatherData.location
    const cur = weatherData.current
    return (
      <div>
        <h3>Weather in {loc.name}, {loc.country}</h3>
        <span><b>Temperature: </b> <p>{cur.temperature} Celsius</p></span>
        <img src={cur.weather_icons[0]} />
        <br></br>
        <span><b>Wind: </b> <p>{cur.wind_speed} kph direction {cur.wind_dir}</p></span>
      </div>
    )
  }

  function countriesToShow() {
    const matches = countries.filter(
      p => p.name.toLowerCase().includes(countryFilter.toLowerCase())
    )
    if (matches.length !== 1 && showWeather === true) {
      console.log("showweather false")
      setShowWeather(false)
    }

    if (matches.length > 10) {
      return (
        <p>Too many matches, specify another filter.</p>
      )
    }
    else if (matches.length === 1) {
      const thecountry = matches[0]
      if (countryFilter !== thecountry.name && !showWeather) setCountryFilter(thecountry.name)
      if (showWeather === false) {
        console.log("showweather true")
        setShowWeather(true)
      }
      return (
        <div>
          <h2>{thecountry.name}</h2>
          <p>Capital {thecountry.capital}</p>
          <p>Population {thecountry.population}</p>
          <h3>Languages</h3>
          <ul>
            {thecountry.languages.map(l => <li key={l.name}>{l.name}</li>)}
          </ul>
          <img src={thecountry.flag} alt="Flag" style={{width: 300}} />
          {renderWeather()}
        </div>
      )
    }
    return (
       <div>
         {matches.map(c => <p key={c.name}>{c.name} <button onClick={showCountry(c.name)}>Show</button></p>)}
       </div>
    )
  }

  function showCountry(country) { return () => {
    setCountryFilter(country)
  }}

  return (
    <div className="App">
      <form>
        Find countries: <input value={countryFilter} onChange={handleCountryFilterChange}></input>
        {countriesToShow()}
      </form>
    </div>
  );
}

export default App;
