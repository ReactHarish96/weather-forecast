import React from 'react'
import { useSelector } from 'react-redux'
import { Handbag, Thermometer, Wind, Droplet } from 'react-bootstrap-icons'
import { staggeredAnimation } from '../utils/animations'

const OutfitRecommendation = () => {
  const { currentWeather: weather, theme } = useSelector(state => state.weather)

  const themeClasses = {
    dark: {
      card: 'bg-gray-800',
      title: 'text-white',
      subtitle: 'text-gray-300',
      item: 'bg-gray-700',
      itemText: 'text-gray-200',
      itemIcon: 'text-gray-400'
    },
    light: {
      card: 'bg-white',
      title: 'text-gray-900',
      subtitle: 'text-gray-600',
      item: 'bg-gray-100',
      itemText: 'text-gray-800',
      itemIcon: 'text-gray-500'
    }
  }

  const currentTheme = themeClasses[theme]

  const getOutfitRecommendations = () => {
    const temp = weather?.temperature || 0
    const condition = (weather?.condition || '').toLowerCase()
    const windSpeed = weather?.windSpeed || 0
    const chanceOfRain = weather?.forecast?.chanceOfRain || 0
    const chanceOfSnow = weather?.forecast?.chanceOfSnow || 0
    const isDay = weather?.isDay
    const uv = weather?.uv || 0

    let recommendations = []

    // Base layer recommendations based on temperature
    if (temp >= 25) {
      recommendations.push(
        { icon: '👕', text: 'Light, breathable clothing' },
        { icon: '🩳', text: 'Shorts or light pants' }
      )
    } else if (temp >= 15) {
      recommendations.push(
        { icon: '👕', text: 'Light layers' },
        { icon: '👖', text: 'Comfortable pants' }
      )
    } else if (temp >= 5) {
      recommendations.push(
        { icon: '🧥', text: 'Warm jacket' },
        { icon: '👖', text: 'Warm pants' }
      )
    } else {
      recommendations.push(
        { icon: '🧥', text: 'Heavy winter coat' },
        { icon: '🧣', text: 'Thermal layers' },
        { icon: '👖', text: 'Insulated pants' }
      )
    }

    // Rain protection
    if (chanceOfRain > 30 || condition.includes('rain') || condition.includes('drizzle')) {
      recommendations.push(
        { icon: '☔', text: 'Rain jacket or umbrella' },
        { icon: '🥾', text: 'Waterproof shoes' }
      )
    }

    // Snow protection
    if (chanceOfSnow > 30 || condition.includes('snow')) {
      recommendations.push(
        { icon: '🧤', text: 'Warm gloves' },
        { icon: '🥾', text: 'Snow boots' },
        { icon: '🧣', text: 'Warm scarf' }
      )
    }

    // Wind protection
    if (windSpeed > 20 || condition.includes('wind')) {
      recommendations.push(
        { icon: '🧥', text: 'Windproof jacket' }
      )
    }

    // Sun protection for daytime
    if (isDay && (uv > 5 || temp > 20)) {
      recommendations.push(
        { icon: '🧢', text: 'Sun hat or cap' },
        { icon: '🕶️', text: 'Sunglasses' }
      )
    }

    // Remove duplicates and limit to 6 items
    const uniqueRecommendations = recommendations.filter((item, index, self) =>
      index === self.findIndex((t) => t.text === item.text)
    ).slice(0, 6)

    return uniqueRecommendations
  }

  if (!weather?.temperature) {
    return (
      <div className={`h-full ${currentTheme.card} rounded-lg p-4 shadow-xl flex flex-col items-center justify-center transition-all duration-300 ease-in-out`}>
        <Handbag className="w-6 h-6 text-gray-400 mb-2" />
        <p className="text-gray-400 text-xs">Search for a city to get outfit recommendations</p>
      </div>
    )
  }

  const recommendations = getOutfitRecommendations()

  return (
    <div 
      key={`${weather.city}-${weather.temperature}`}
      className={`h-full ${currentTheme.card} rounded-lg shadow-xl flex flex-col transition-opacity duration-700 ease-in-out opacity-0 animate-fade-in`}
    >
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        <div className="flex items-center">
          <Handbag className="w-4 h-4 text-gray-400 mr-2" />
          <h3 className={`text-sm font-medium ${currentTheme.title}`}>
            Outfit Recommendations
          </h3>
        </div>
      </div>

      <div className="flex-1 p-4">
        <div className="space-y-3">
          {recommendations.map((item, index) => (
            <div
              key={`${item.text}-${index}`}
              className={`${currentTheme.item} rounded-lg p-3 flex items-center transition-opacity duration-700 hover:opacity-90`}
            >
              <div className="text-xl mr-3">{item.icon}</div>
              <div className={`${currentTheme.itemText} text-sm`}>
                {item.text}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default OutfitRecommendation 