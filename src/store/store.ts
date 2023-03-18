// Import necessary Redux toolkit functions and types
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import globalReducer from './reducers/GlobalSlice'
import userReducer from './reducers/UserSlice'
import usersReducer from './reducers/UsersSlice'
import postsReducer from './reducers/PostsSlice'
import bookmarksReducer from './reducers/BookmarksSlice'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

// Combine all reducers into a root reducer
const rootReducer = combineReducers({
  global: globalReducer,
  user: userReducer,
  users: usersReducer,
  posts: postsReducer,
  bookmarks: bookmarksReducer,
})

// Configure persistence settings
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  blacklist: ['users'], // Don't persist the users slice
}

// Create a persisted reducer from the root reducer and persist configuration
const persistedReducer = persistReducer(persistConfig, rootReducer)

// Create the Redux store with the persisted reducer and middleware
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

// Create a function to setup the store
const setupStore = () => store

// Export the persistor, store, and necessary types
export const persistor = persistStore(store)
export default store
export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
