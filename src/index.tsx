// Importing necessary dependencies and components
import ReactDOM from 'react-dom/client'  // ReactDOM is used to render the app on the DOM
import { App } from './App'  // Main component of the application
import { SnackbarProvider } from 'notistack'  // A notification library used in the application
import { AuthProvider } from './components/providers/AuthProvider'  // A custom provider used for authentication purposes
import { Grow } from '@mui/material'  // A component from Material UI library used for transitions
import './index.css'  // CSS styles for the application
import './i18n'  // Internationalization library used in the application
import './firebase'  // Firebase library used for server-side functionalities
import { Provider } from 'react-redux'  // A component used for Redux store configuration
import store, { persistor } from './store/store'  // Redux store and persistor configuration
import { PersistGate } from 'redux-persist/integration/react'  // A component used for Redux state persistence
import { initI18next } from './i18n'  // A function to initialize i18n library

// Creating a root element to render the application on
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

// An asynchronous function to initialize the i18n library before rendering the application
const onBeforeLift = async () => {
  await initI18next()
}

// Rendering the entire application using Provider and PersistGate components from Redux and SnackbarProvider and AuthProvider components from the application
root.render(
  <Provider store={store}>
    <PersistGate
      loading={null}
      persistor={persistor}
      onBeforeLift={onBeforeLift}
    >
      <SnackbarProvider
        maxSnack={1}
        autoHideDuration={3000}
        TransitionComponent={Grow}
      >
        <AuthProvider>
          <App />
        </AuthProvider>
      </SnackbarProvider>
    </PersistGate>
  </Provider>
)
