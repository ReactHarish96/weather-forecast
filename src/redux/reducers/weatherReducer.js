import {
  FETCH_WEATHER_REQUEST,
  FETCH_WEATHER_SUCCESS,
  FETCH_WEATHER_FAILURE,
  CLEAR_ERROR,
  ADD_TO_HISTORY,
  FETCH_SUGGESTIONS_REQUEST,
  FETCH_SUGGESTIONS_SUCCESS,
  FETCH_SUGGESTIONS_FAILURE,
  CLEAR_SUGGESTIONS,
  TOGGLE_THEME,
  SET_THEME,
  SET_OFFLINE_STATUS,
  RETRY_WEATHER_REQUEST,
  SET_LAST_QUERY
} from '../actions/weatherActions'

// Load persisted state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('weatherState')
    if (serializedState === null) {
      return undefined
    }
    const state = JSON.parse(serializedState)
    return {
      ...state,
      loading: false,
      error: null,
      suggestions: [],
      suggestionsLoading: false,
      suggestionsError: null
    }
  } catch (err) {
    return undefined
  }
}

// Save state to localStorage
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify({
      currentWeather: state.currentWeather,
      searchHistory: state.searchHistory,
      theme: state.theme,
      activeSearchItem: state.activeSearchItem
    })
    localStorage.setItem('weatherState', serializedState)
  } catch (err) {
    // Ignore write errors
  }
}

const initialState = loadState() || {
  currentWeather: null,
  searchHistory: [],
  loading: false,
  error: null,
  suggestions: [],
  suggestionsLoading: false,
  suggestionsError: null,
  theme: 'dark',
  isOffline: false,
  retryCount: 0,
  lastQuery: null,
  activeSearchItem: null
}

const addToHistoryHelper = (history, newEntry) => {
  const existingIndex = history.findIndex(
    item => item.city === newEntry.city
  )
  
  let newHistory = [...history]
  
  if (existingIndex !== -1) {
    // Update the existing entry's weather data but keep its position
    newHistory[existingIndex] = {
      ...newEntry,
      timestamp: newHistory[existingIndex].timestamp
    }
    return newHistory
  }
  
  // Add to beginning of array only if it's a new entry
  newHistory?.unshift(newEntry)
  
  // Keep only last 5 entries
  if (newHistory?.length > 5) {
    newHistory = newHistory?.slice(0, 5)
  }
  
  return newHistory
}

const weatherReducer = (state = initialState, action) => {
  let newState = state

  switch (action.type) {
    case FETCH_WEATHER_REQUEST:
      newState = {
        ...state,
        loading: true,
        error: null
      }
      break

    case FETCH_WEATHER_SUCCESS:
      newState = {
        ...state,
        loading: false,
        currentWeather: action.payload,
        error: null,
        activeSearchItem: action?.payload?.city,
        retryCount: 0,
        lastQuery: action?.payload?.originalQuery || action?.payload?.city
      }
      break

    case FETCH_WEATHER_FAILURE:
      newState = {
        ...state,
        loading: false,
        error: action.payload,
        currentWeather: null
      }
      break

    case CLEAR_ERROR:
      newState = {
        ...state,
        error: null
      }
      break

    case ADD_TO_HISTORY:
      newState = {
        ...state,
        searchHistory: addToHistoryHelper(state.searchHistory, action.payload)
      }
      break

    case FETCH_SUGGESTIONS_REQUEST:
      newState = {
        ...state,
        suggestionsLoading: true,
        suggestionsError: null
      }
      break

    case FETCH_SUGGESTIONS_SUCCESS:
      newState = {
        ...state,
        suggestionsLoading: false,
        suggestions: action.payload,
        suggestionsError: null
      }
      break

    case FETCH_SUGGESTIONS_FAILURE:
      newState = {
        ...state,
        suggestionsLoading: false,
        suggestionsError: action.payload,
        suggestions: []
      }
      break

    case CLEAR_SUGGESTIONS:
      newState = {
        ...state,
        suggestions: [],
        suggestionsLoading: false,
        suggestionsError: null
      }
      break

    case TOGGLE_THEME:
      newState = {
        ...state,
        theme: state.theme === 'light' ? 'dark' : 'light'
      }
      break

    case SET_THEME:
      newState = {
        ...state,
        theme: action.payload
      }
      break

    case SET_OFFLINE_STATUS:
      newState = {
        ...state,
        isOffline: action.payload
      }
      break

    case RETRY_WEATHER_REQUEST:
      newState = {
        ...state,
        retryCount: state.retryCount + 1
      }
      break

    case SET_LAST_QUERY:
      newState = {
        ...state,
        lastQuery: action.payload
      }
      break

    default:
      return state
  }

  // Save state to localStorage after each action
  saveState(newState)
  return newState
}

export default weatherReducer 