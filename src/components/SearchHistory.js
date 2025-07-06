import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchWeatherData } from '../redux/actions/weatherActions'
import { Clock, GeoAlt } from 'react-bootstrap-icons'

const SearchHistory = () => {
  const { searchHistory, theme, activeSearchItem } = useSelector(state => state.weather)
  const dispatch = useDispatch()

  const handleCityClick = (cityName) => {
    dispatch(fetchWeatherData(cityName, false)) // false indicates not to update search history
  }

  const themeClasses = {
    dark: {
      card: 'bg-gray-800',
      title: 'text-white',
      item: 'bg-gray-700 hover:bg-gray-600',
      activeItem: 'bg-gray-600',
      itemText: 'text-gray-200',
      itemSubtext: 'text-gray-400',
      itemTimestamp: 'text-gray-500'
    },
    light: {
      card: 'bg-white',
      title: 'text-gray-900',
      item: 'bg-gray-100 hover:bg-gray-200',
      activeItem: 'bg-gray-200',
      itemText: 'text-gray-800',
      itemSubtext: 'text-gray-600',
      itemTimestamp: 'text-gray-500'
    }
  }

  const currentTheme = themeClasses[theme]

  if (searchHistory.length === 0) {
    return (
      <div className={`h-full ${currentTheme.card} rounded-lg p-3 shadow-xl flex flex-col items-center justify-center`}>
        <Clock className="w-5 h-5 text-gray-400 mb-2" />
        <p className="text-gray-400 text-xs">No recent searches</p>
      </div>
    )
  }

  return (
    <div 
      className={`h-full ${currentTheme.card} rounded-lg shadow-xl flex flex-col transition-opacity duration-700 ease-in-out opacity-0 animate-fade-in`}
    >
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        <div className="flex items-center">
          <Clock className="w-4 h-4 text-gray-400 mr-2" />
          <h3 className={`text-sm font-medium ${currentTheme.title}`}>
            Recent Searches
          </h3>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-2">
          {searchHistory.map((weather, index) => (
            <button
              key={`${weather.city}-${weather.timestamp}`}
              onClick={() => handleCityClick(weather.city)}
              className={`${weather.city === activeSearchItem ? currentTheme.activeItem : currentTheme.item} 
                rounded-lg p-3 text-left transition-opacity duration-700 group w-full hover:opacity-90`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center mb-1">
                    <GeoAlt className="w-3 h-3 text-blue-400 mr-1" />
                    <div className={`${currentTheme.itemText} text-xs font-medium`}>
                      {weather.city}
                    </div>
                  </div>
                  <div className={`${currentTheme.itemSubtext} text-xs flex items-center`}>
                    {weather.temperature}°C • {weather.condition}
                  </div>
                </div>
                <div className={`${currentTheme.itemTimestamp} text-[10px]`}>
                  {new Date(weather.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SearchHistory 