import { createSlice } from '@reduxjs/toolkit'
import { IGlobalState } from '../../types'

const preferredLanguage = navigator.language.slice(0, 2) === 'vn' ? 'vn' : 'en'
const preferredTheme = window.matchMedia('(prefers-color-scheme: light)')
  .matches
  ? 'light'
  : 'dark'

const initialState = {
  language: preferredLanguage,
  theme: preferredTheme,
} as IGlobalState

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setLangVN(state) {
      state.language = 'vn'
    },
    setLangEN(state) {
      state.language = 'en'
    },
    setThemeLight(state) {
      state.theme = 'light'
    },
    setThemeDark(state) {
      state.theme = 'dark'
    },
  },
})

export default globalSlice.reducer
