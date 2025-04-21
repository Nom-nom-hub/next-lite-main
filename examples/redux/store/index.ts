import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import counterReducer from './slices/counterSlice';
import todosReducer from './slices/todosSlice';

// Root reducer
const rootReducer = combineReducers({
  counter: counterReducer,
  todos: todosReducer,
});

// Create store
export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
});

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
