const API_KEY = 'aaecd2b9c07a4492873112352250607' // WeatherAPI.com key
const BASE_URL = 'https://api.weatherapi.com/v1'

// Action Types
export const FETCH_WEATHER_REQUEST = 'FETCH_WEATHER_REQUEST'
export const FETCH_WEATHER_SUCCESS = 'FETCH_WEATHER_SUCCESS'
export const FETCH_WEATHER_FAILURE = 'FETCH_WEATHER_FAILURE'
export const CLEAR_ERROR = 'CLEAR_ERROR'
export const ADD_TO_HISTORY = 'ADD_TO_HISTORY'

// City Suggestions Action Types
export const FETCH_SUGGESTIONS_REQUEST = 'FETCH_SUGGESTIONS_REQUEST'
export const FETCH_SUGGESTIONS_SUCCESS = 'FETCH_SUGGESTIONS_SUCCESS'
export const FETCH_SUGGESTIONS_FAILURE = 'FETCH_SUGGESTIONS_FAILURE'
export const CLEAR_SUGGESTIONS = 'CLEAR_SUGGESTIONS'

// Theme Action Types
export const TOGGLE_THEME = 'TOGGLE_THEME'
export const SET_THEME = 'SET_THEME'

// Offline/Retry Action Types
export const SET_OFFLINE_STATUS = 'SET_OFFLINE_STATUS'
export const RETRY_WEATHER_REQUEST = 'RETRY_WEATHER_REQUEST'
export const SET_LAST_QUERY = 'SET_LAST_QUERY'

// Action Creators
export const fetchWeatherRequest = () => ({
  type: FETCH_WEATHER_REQUEST
})

export const fetchWeatherSuccess = (weatherData) => ({
  type: FETCH_WEATHER_SUCCESS,
  payload: weatherData
})

export const fetchWeatherFailure = (error) => ({
  type: FETCH_WEATHER_FAILURE,
  payload: error
})

export const clearError = () => ({
  type: CLEAR_ERROR
})

export const addToHistory = (weatherData) => ({
  type: ADD_TO_HISTORY,
  payload: weatherData
})

// City Suggestions Action Creators
export const fetchSuggestionsRequest = () => ({
  type: FETCH_SUGGESTIONS_REQUEST
})

export const fetchSuggestionsSuccess = (suggestions) => ({
  type: FETCH_SUGGESTIONS_SUCCESS,
  payload: suggestions
})

export const fetchSuggestionsFailure = (error) => ({
  type: FETCH_SUGGESTIONS_FAILURE,
  payload: error
})

export const clearSuggestions = () => ({
  type: CLEAR_SUGGESTIONS
})

// Theme Action Creators
export const toggleTheme = () => ({
  type: TOGGLE_THEME
})

export const setTheme = (theme) => ({
  type: SET_THEME,
  payload: theme
})

// Offline/Retry Action Creators
export const setOfflineStatus = (isOffline) => ({
  type: SET_OFFLINE_STATUS,
  payload: isOffline
})

export const retryWeatherRequest = () => ({
  type: RETRY_WEATHER_REQUEST
})

// Async Action Creator (Thunk) - Updated for WeatherAPI.com
export const fetchWeatherData = (cityName, updateHistory = true) => {
  return async (dispatch) => {
    dispatch(fetchWeatherRequest())
    
    try {
      const response = await fetch(
        `${BASE_URL}/forecast.json?key=${API_KEY}&q=${cityName}&aqi=no&days=1`
      )
      
      if (!response.ok) {
        // Get the specific error message from the API
        const errorData = await response.json()
        throw new Error(errorData.error?.message || 'Weather data not found')
      }
      
      const data = await response.json()
      const weatherData = {
        city: data.location.name,
        country: data.location.country,
        region: data.location.region,
        temperature: Math.round(data.current.temp_c),
        feelsLike: Math.round(data.current.feelslike_c),
        condition: data.current.condition.text,
        description: data.current.condition.text,
        humidity: data.current.humidity,
        windSpeed: data.current.wind_kph,
        windDirection: data.current.wind_dir,
        precipitation: data.current.precip_mm,
        uv: data.current.uv,
        icon: data.current.condition.icon,
        isDay: data.current.is_day,
        timestamp: new Date().toISOString(),
        originalQuery: cityName,
        forecast: data.forecast?.forecastday?.[0]?.day ? {
          maxTemp: Math.round(data.forecast.forecastday[0].day.maxtemp_c),
          minTemp: Math.round(data.forecast.forecastday[0].day.mintemp_c),
          chanceOfRain: data.forecast.forecastday[0].day.daily_chance_of_rain,
          chanceOfSnow: data.forecast.forecastday[0].day.daily_chance_of_snow
        } : null
      }
      
      dispatch(fetchWeatherSuccess(weatherData))
      if (updateHistory) {
        dispatch(addToHistory(weatherData))
      }
    } catch (error) {
      dispatch(fetchWeatherFailure(error.message))
      // Store the failed query for retry
      dispatch({
        type: 'SET_LAST_QUERY',
        payload: cityName
      })
    }
  }
}

// Auto-suggest city names - Debounced API call
export const fetchCitySuggestions = (query) => {
  return async (dispatch) => {
    if (!query || query.length < 3) {
      dispatch(clearSuggestions())
      return
    }

    dispatch(fetchSuggestionsRequest())
    
    try {
      const response = await fetch(
        `${BASE_URL}/search.json?key=${API_KEY}&q=${query}&aqi=no`
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch city suggestions')
      }
      
      const data = await response.json()
      const suggestions = data.slice(0, 5).map(city => ({
        name: city.name,
        region: city.region,
        country: city.country,
        fullName: `${city.name}, ${city.region}, ${city.country}`
      }))
      
      dispatch(fetchSuggestionsSuccess(suggestions))
    } catch (error) {
      dispatch(fetchSuggestionsFailure(error.message))
    }
  }
}

// Retry mechanism for failed requests
export const retryLastRequest = (lastQuery) => {
  return async (dispatch) => {
    if (!lastQuery) return
    
    dispatch(retryWeatherRequest())
    dispatch(fetchWeatherData(lastQuery))
  }
}

// Offline detection
export const detectOfflineStatus = () => {
  return (dispatch) => {
    const updateOnlineStatus = () => {
      dispatch(setOfflineStatus(!navigator.onLine))
    }
    
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)
    
    // Initial check
    updateOnlineStatus()
    
    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }
} 