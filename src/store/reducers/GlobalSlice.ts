// Import necessary Redux toolkit functions and types
import { createSlice } from '@reduxjs/toolkit'
import { IGlobalState } from '../../types'

// Get the user's preferred language and theme
const preferredLanguage = navigator.language.slice(0, 2) === 'vn' ? 'vn' : 'en'
const preferredTheme = window.matchMedia('(prefers-color-scheme: light)')
  .matches
  ? 'light'
  : 'dark'

// Define initial state for the global slice
const initialState = {
  language: preferredLanguage,
  theme: preferredTheme,
} as IGlobalState

// Create the global slice
export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    // Set language to Vietnamese
    setLangVN(state) {
      state.language = 'vn'
    },
    // Set language to English
    setLangEN(state) {
      state.language = 'en'
    },
    // Set theme to light
    setThemeLight(state) {
      state.theme = 'light'
    },
    // Set theme to dark
    setThemeDark(state) {
      state.theme = 'dark'
    },
  },
})

// Export the reducer for the global slice
export default globalSlice.reducer
