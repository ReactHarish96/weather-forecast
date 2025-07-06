import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { detectOfflineStatus } from './redux/actions/weatherActions'
import CitySearch from './components/CitySearch'
import WeatherDisplay from './components/WeatherDisplay'
import OutfitRecommendation from './components/OutfitRecommendation'
import SearchHistory from './components/SearchHistory'
import ErrorMessage from './components/ErrorMessage'
import ThemeToggle from './components/ThemeToggle'
import { Cloud, CloudSun, GeoAlt, Search } from 'react-bootstrap-icons'
import './App.css'

function App() {
  const { theme, isOffline, currentWeather } = useSelector(state => state.weather)
  const dispatch = useDispatch()

  useEffect(() => {
    // Set up offline detection
    const cleanup = dispatch(detectOfflineStatus())
    return cleanup
  }, [dispatch])

  const themeClasses = {
    dark: {
      bg: 'bg-gray-900',
      text: 'text-white',
      cardBg: 'bg-gray-800',
      cardText: 'text-gray-400',
      gradient: 'from-blue-400 to-purple-600'
    },
    light: {
      bg: 'bg-gray-100',
      text: 'text-gray-900',
      cardBg: 'bg-white',
      cardText: 'text-gray-600',
      gradient: 'from-blue-600 to-purple-700'
    }
  }

  const currentTheme = themeClasses[theme]

  return (
    <div className={`h-screen ${currentTheme.bg} ${currentTheme.text} transition-colors duration-500 overflow-hidden`}>
      {!currentWeather ? (
        // Initial centered search screen
        <div className="h-full flex flex-col items-center justify-center p-4">
          <div className="text-center mb-8 animate-fade-in">
            <div className="flex items-center justify-center mb-4">
              <CloudSun className="w-16 h-16 text-blue-500 mr-2" />
              <h1 className={`text-4xl font-bold bg-gradient-to-r ${currentTheme.gradient} bg-clip-text text-transparent`}>
                Weather Dashboard
              </h1>
            </div>
            <p className={`${currentTheme.cardText} text-lg`}>
              Enter a city name to get weather information and outfit recommendations
            </p>
          </div>
          
          <div className="w-full max-w-3xl animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
            <CitySearch />
          </div>

          <div className="absolute top-4 right-4">
            <ThemeToggle />
          </div>

          {isOffline && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="p-2 bg-red-900 bg-opacity-50 border border-red-500 rounded-lg animate-shake">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-red-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-red-200 text-xs">You're offline</span>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        // Dashboard layout after search
        <div className="h-full flex flex-col">
          {/* Header with Search */}
          <div className="flex-shrink-0 p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <div className="w-64">
                  <CitySearch />
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {isOffline && (
                  <div className="p-2 bg-red-900 bg-opacity-50 border border-red-500 rounded-lg animate-shake">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-red-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span className="text-red-200 text-xs">Offline</span>
                    </div>
                  </div>
                )}
                <ThemeToggle />
              </div>
            </div>
          </div>

          {/* Main Dashboard Content */}
          <div className="flex-1 p-3 overflow-hidden">
            {/* Error Message Row */}
            <div className="mb-3">
              <ErrorMessage />
            </div>

            {/* Three Column Layout */}
            <div className="grid grid-cols-3 gap-3" style={{ height: 'calc(100vh - 160px)' }}>
              {/* Weather Display - Left Section */}
              <div className="col-span-1">
                <WeatherDisplay />
              </div>

              {/* Outfit Recommendations - Middle Section */}
              <div className="col-span-1">
                <OutfitRecommendation />
              </div>

              {/* Search History - Right Section */}
              <div className="col-span-1">
                <SearchHistory />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App 