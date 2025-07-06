# Weather Forecast Application

This is a React-based weather forecast application that provides weather information and outfit recommendations based on weather conditions.

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ReactHarish96/weather-forecast.git
cd weather-forecast
```

2. Install dependencies:
```bash
npm install
```

### Running the Application

To run the application locally:

```bash
npm start
```

The application will start in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### Troubleshooting

If you encounter any issues running the application:

1. Clear your node_modules and reinstall dependencies:
```bash
rm -rf node_modules
npm cache clean --force
npm install
```

2. Ensure you're in the correct directory:
```bash
cd weather-forecast
```

3. Check if port 3000 is already in use. If so, the development server will automatically try to use the next available port.

### Key Features
- City-based weather search
- Weather condition display
- Outfit recommendations
- Search history
- Theme toggle (Light/Dark mode)
