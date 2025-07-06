import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchWeatherData, fetchCitySuggestions, clearSuggestions } from '../redux/actions/weatherActions'
import { useDebounce } from '../hooks/useDebounce'
import { Search, GeoFill, HouseDoorFill } from 'react-bootstrap-icons'

const CitySearch = () => {
  const [city, setCity] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const dispatch = useDispatch()
  const { loading, suggestions, suggestionsLoading, theme, currentWeather } = useSelector(state => state.weather)
  const inputRef = useRef(null)
  const suggestionsRef = useRef(null)

  // Debounce the city input to avoid excessive API calls
  const debouncedCity = useDebounce(city, 300)

  // Fetch suggestions when debounced city changes
  useEffect(() => {
    if (debouncedCity && debouncedCity.length >= 3) {
      dispatch(fetchCitySuggestions(debouncedCity))
      setShowSuggestions(true)
    } else {
      dispatch(clearSuggestions())
      setShowSuggestions(false)
    }
  }, [debouncedCity, dispatch])

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) &&
          inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (city.trim()) {
      dispatch(fetchWeatherData(city.trim()))
      setCity('')
      setShowSuggestions(false)
      setSelectedIndex(-1)
    }
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setCity(value)
    setSelectedIndex(-1)
    
    if (value.length >= 3) {
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setCity(suggestion.name)
    setShowSuggestions(false)
    setSelectedIndex(-1)
    dispatch(fetchWeatherData(suggestion.name))
  }

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => prev < suggestions.length - 1 ? prev + 1 : prev)
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : prev)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex])
        } else {
          handleSubmit(e)
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        setSelectedIndex(-1)
        break
      default:
        break
    }
  }

  const handleHomeClick = () => {
    // Clear the current weather to trigger the transition
    dispatch({ type: 'FETCH_WEATHER_SUCCESS', payload: null })
    
    // Reset all local states
    setCity('')
    setShowSuggestions(false)
    setSelectedIndex(-1)

    // Focus the input after a short delay to allow for transition
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, 100)
  }

  const themeClasses = {
    dark: {
      input: 'bg-gray-800 text-white border-gray-700 focus:border-blue-500',
      suggestions: 'bg-gray-800 border-gray-700',
      suggestionItem: 'text-gray-300 hover:bg-gray-700',
      suggestionSelected: 'bg-blue-600 text-white',
      searchIcon: 'text-gray-400',
      button: 'bg-gray-700 hover:bg-gray-600 text-white'
    },
    light: {
      input: 'bg-white text-gray-900 border-gray-300 focus:border-blue-500',
      suggestions: 'bg-white border-gray-300',
      suggestionItem: 'text-gray-700 hover:bg-gray-100',
      suggestionSelected: 'bg-blue-600 text-white',
      searchIcon: 'text-gray-500',
      button: 'bg-gray-100 hover:bg-gray-200 text-gray-800'
    }
  }

  const currentTheme = themeClasses[theme]

  return (
    <div className={`relative w-full transition-all duration-500 ease-in-out ${!currentWeather ? 'flex items-center justify-center min-h-[200px]' : ''}`}>
      <div className={`flex items-center gap-2 justify-center transition-all duration-500 ease-in-out ${!currentWeather ? 'w-full max-w-lg transform scale-110' : 'w-full'}`}>
        <form onSubmit={handleSubmit} className="flex-1 relative">
          <div className="flex flex-col space-y-2">
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Search className={`w-4 h-4 ${currentTheme.searchIcon}`} />
              </div>
              <input
                ref={inputRef}
                type="text"
                value={city}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => city.length >= 3 && setShowSuggestions(true)}
                placeholder="Search for a city..."
                className={`w-full pl-10 pr-10 py-3 rounded-lg border text-base focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors ${currentTheme.input}`}
                disabled={loading}
                autoComplete="off"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {suggestionsLoading ? (
                  <svg className="animate-spin h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <GeoFill className={`w-4 h-4 ${currentTheme.searchIcon} cursor-pointer hover:text-blue-500 transition-colors`} />
                )}
              </div>
            </div>
            
            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div 
                ref={suggestionsRef}
                className={`absolute top-full left-0 right-0 mt-1 border rounded-lg shadow-xl z-10 max-h-48 overflow-y-auto animate-slide-in-down ${currentTheme.suggestions}`}
              >
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={`px-4 py-2.5 cursor-pointer transition-all duration-200 animate-fade-in whitespace-nowrap overflow-hidden text-ellipsis ${
                      selectedIndex === index 
                        ? `${currentTheme.suggestionSelected}` 
                        : `${currentTheme.suggestionItem}`
                    }`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="font-medium text-sm truncate">{suggestion.name}</div>
                    <div className={`text-xs truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {suggestion.region}, {suggestion.country}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>
        
        {/* Home Button */}
        <button
          onClick={handleHomeClick}
          className={`p-2 rounded-lg transition-all duration-300 ${currentTheme.button} ${currentWeather ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
          disabled={!currentWeather}
          title="Return to home screen"
        >
          <HouseDoorFill className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

export default CitySearch 