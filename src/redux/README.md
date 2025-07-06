# Redux Setup Documentation

## Project Structure

```
src/redux/
├── store.js              # Redux store configuration
├── actions/
│   └── counterActions.js # Traditional action creators
├── reducers/
│   └── counterReducer.js # Redux Toolkit slice (modern approach)
└── index.js              # Centralized exports
```

## Files Overview

### 1. `store.js`
- Configures the Redux store using Redux Toolkit's `configureStore`
- Combines all reducers
- Exports the store for use in the application

### 2. `actions/counterActions.js`
- Traditional action creators and action types
- Contains: INCREMENT, DECREMENT, RESET, SET_VALUE actions

### 3. `reducers/counterReducer.js`
- Modern Redux Toolkit slice approach
- Uses `createSlice` for automatic action creators and reducer generation
- Handles immutable state updates with Immer under the hood

### 4. `index.js`
- Centralized export file for easier imports
- Exports store, actions, and reducer actions

## Usage in Components

```javascript
import { useSelector, useDispatch } from 'react-redux'
import { increment, decrement, reset, setValue } from './redux/reducers/counterReducer'

function MyComponent() {
  const count = useSelector((state) => state.counter.value)
  const dispatch = useDispatch()

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(decrement())}>-</button>
      <button onClick={() => dispatch(reset())}>Reset</button>
      <button onClick={() => dispatch(setValue(10))}>Set to 10</button>
    </div>
  )
}
```

## Key Features

- **Redux Toolkit**: Modern, recommended approach for Redux
- **Immer Integration**: Allows "mutative" logic for immutable updates
- **TypeScript Ready**: Easy to add TypeScript support
- **DevTools**: Automatically configured for Redux DevTools Extension
- **Hot Reloading**: Works seamlessly with Vite's HMR

## Adding New Features

1. Create a new slice in `reducers/` directory
2. Add the reducer to `store.js`
3. Export actions from the new slice
4. Use in components with `useSelector` and `useDispatch` 