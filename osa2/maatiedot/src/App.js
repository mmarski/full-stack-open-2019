import React, { useState, useEffect } from 'react'
import axios from 'axios';

function App() {
  const [ countries, setCountries] = useState([])
  const [ countryFilter, setCountryFilter ] = useState('')

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

  function countriesToShow() {
    const matches = countries.filter(
      p => p.name.toLowerCase().includes(countryFilter.toLowerCase())
    )
    if (matches.length > 10) {
      return (
        <p>Too many matches, specify another filter.</p>
      )
    }
    else if (matches.length === 1) {
      const thecountry = matches[0]
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
        </div>
      )
    }
    return (
       <div>
         {matches.map(c => <p key={c.name}>{c.name}</p>)}
       </div>
    )
  } 

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
