import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { clearError, retryLastRequest } from '../redux/actions/weatherActions'

const ErrorMessage = () => {
  const { error, isOffline, retryCount, lastQuery, theme } = useSelector(state => state.weather)
  const dispatch = useDispatch()

  if (!error) {
    return null
  }

  const handleRetry = () => {
    if (lastQuery) {
      dispatch(retryLastRequest(lastQuery))
    }
  }

  const handleDismiss = () => {
    dispatch(clearError())
  }

  const themeClasses = {
    dark: {
      container: 'bg-red-900 bg-opacity-50 border-red-500 text-red-200',
      button: 'text-red-400 hover:text-red-300'
    },
    light: {
      container: 'bg-red-100 border-red-400 text-red-700',
      button: 'text-red-600 hover:text-red-500'
    }
  }

  const currentTheme = themeClasses[theme]

  return (
    <div className={`${currentTheme.container} border px-3 py-2 rounded-lg max-w-md mx-auto animate-shake`}>
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-medium">Error</span>
          </div>
          <button
            onClick={handleDismiss}
            className={`${currentTheme.button} ml-2 transition-colors duration-200`}
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="text-xs">
          {error}
        </div>
        
        {/* Offline indicator and retry section */}
        {isOffline && (
          <div className="flex items-center text-xs opacity-75">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
            </svg>
            You appear to be offline
          </div>
        )}
        
        {/* Retry button */}
        {lastQuery && retryCount < 3 && (
          <div className="flex items-center justify-between">
            <button
              onClick={handleRetry}
              className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium transition-colors duration-200 ${
                theme === 'dark' 
                  ? 'bg-red-800 hover:bg-red-700 text-red-100' 
                  : 'bg-red-200 hover:bg-red-300 text-red-800'
              }`}
            >
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Retry ({retryCount}/3)
            </button>
            
            <span className="text-xs opacity-75">
              Last search: {lastQuery}
            </span>
          </div>
        )}
        
        {/* Max retries reached */}
        {retryCount >= 3 && (
          <div className="text-xs opacity-75">
            Maximum retry attempts reached. Please check your connection and try again later.
          </div>
        )}
      </div>
    </div>
  )
}

export default ErrorMessage 