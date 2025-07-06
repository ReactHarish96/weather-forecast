import React from 'react'
import { useSelector } from 'react-redux'
import { Thermometer, Droplet, Wind } from 'react-bootstrap-icons'

const WeatherDisplay = () => {
  const { currentWeather: weather, theme } = useSelector(state => state.weather)

  const themeClasses = {
    dark: {
      card: 'bg-gray-800',
      title: 'text-white',
      subtitle: 'text-gray-300',
      detailCard: 'bg-gray-700',
      detailTitle: 'text-gray-400',
      detailValue: 'text-gray-200',
      temperature: 'text-white'
    },
    light: {
      card: 'bg-white',
      title: 'text-gray-900',
      subtitle: 'text-gray-600',
      detailCard: 'bg-gray-100',
      detailTitle: 'text-gray-500',
      detailValue: 'text-gray-800',
      temperature: 'text-gray-900'
    }
  }

  const currentTheme = themeClasses[theme]

  const getWeatherIcon = (condition) => {
    const conditionLower = condition?.toLowerCase() || ''
    if (conditionLower.includes('sunny') || conditionLower.includes('clear')) {
      return <div className="text-5xl animate-bounce">☀️</div>
    } else if (conditionLower.includes('cloud') || conditionLower.includes('overcast')) {
      return <div className="text-5xl animate-bounce">☁️</div>
    } else if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
      return <div className="text-5xl animate-bounce">🌧️</div>
    } else if (conditionLower.includes('snow') || conditionLower.includes('sleet')) {
      return <div className="text-5xl animate-bounce">❄️</div>
    } else if (conditionLower.includes('mist') || conditionLower.includes('fog')) {
      return <div className="text-5xl animate-bounce">🌫️</div>
    } else if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
      return <div className="text-5xl animate-bounce">⛈️</div>
    } else {
      return <div className="text-5xl">⛅</div>
    }
  }

  if (!weather?.temperature) {
    return (
      <div className={`h-full ${currentTheme.card} rounded-lg p-4 shadow-xl flex flex-col items-center justify-center transition-all duration-300 ease-in-out`}>
        <Thermometer className="w-6 h-6 text-gray-400 mb-2" />
        <p className="text-gray-400 text-xs">Search for a city to view weather</p>
      </div>
    )
  }

  return (
    <div 
      key={`${weather.city}-${weather.temperature}`} 
      className={`h-full ${currentTheme.card} rounded-lg shadow-xl flex flex-col transition-opacity duration-700 ease-in-out opacity-0 animate-fade-in`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        <div className="flex items-center">
          <Thermometer className="w-4 h-4 text-gray-400 mr-2" />
          <h3 className={`text-sm font-medium ${currentTheme.title}`}>
            Current Weather
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col">
        {/* City and Condition */}
        <div 
          className="text-center mb-4"
        >
          <h2 className={`text-xl font-bold ${currentTheme.title}`}>
            {weather.city}
            {weather.country && <span className="text-sm ml-2">({weather.country})</span>}
          </h2>
          <div className={`text-sm ${currentTheme.subtitle}`}>
            {weather.condition}
          </div>
        </div>

        {/* Temperature and Icon */}
        <div 
          className="flex-1 flex flex-col items-center justify-center mb-6"
        >
          <div className="relative mb-2">
            {getWeatherIcon(weather.condition)}
          </div>
          <div className={`${currentTheme.temperature} text-6xl font-bold`}>
            {weather.temperature}°C
          </div>
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-3 gap-2">
          {[
            {
              icon: <Thermometer className="w-4 h-4 mx-auto mb-1 text-red-400" />,
              title: 'Feels Like',
              value: `${weather.feelsLike}°`
            },
            {
              icon: <Droplet className="w-4 h-4 mx-auto mb-1 text-blue-400" />,
              title: 'Humidity',
              value: `${weather.humidity}%`
            },
            {
              icon: <Wind className="w-4 h-4 mx-auto mb-1 text-green-400" />,
              title: 'Wind',
              value: `${weather.windSpeed} km/h`
            }
          ].map((detail, index) => (
            <div
              key={`${detail.title}-${detail.value}`}
              className={`${currentTheme.detailCard} rounded-lg p-2 text-center transition-opacity duration-700 hover:opacity-90`}
            >
              {detail.icon}
              <div className={`${currentTheme.detailTitle} text-xs`}>{detail.title}</div>
              <div className={`${currentTheme.detailValue} text-sm font-medium`}>
                {detail.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default WeatherDisplay 