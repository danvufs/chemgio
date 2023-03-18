// Import necessary components and functions
import { FC } from 'react'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { RoutesList } from './components/routes/RoutesList'
import { themeDark, themeLight } from './components/theme/themes'
import './App.css'
import { useAppSelector } from './hooks/redux'

// Define the App component
export const App: FC = () => {
  // Get the current theme from the global state
  const { theme } = useAppSelector((state) => state.global)

  // Return the app with the current theme applied
  return (
    <ThemeProvider theme={theme === 'light' ? themeLight : themeDark}>
      <CssBaseline />
      <RoutesList />
    </ThemeProvider>
  )
}
