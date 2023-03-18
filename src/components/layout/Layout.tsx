// Import necessary modules from various libraries
import { FC, ReactElement } from 'react'
import { Container } from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2/Grid2'
import { Sidebar } from './sidebar/Sidebar'
import { Header } from './header/Header'
import { Footer } from './footer/Footer'
import { useAppSelector } from '../../hooks/redux'
import { Analytics } from '@vercel/analytics/react'

// Define the Props interface for the `Layout` component
type Props = {
  children: ReactElement
}

// Define a React functional component named `Layout` using the `FC` type from React and the `Props` interface.
export const Layout: FC<Props> = ({ children }) => {
  const { isAuth } = useAppSelector((state) => state.user) // Get the `isAuth` value from the Redux store

  // Render the component
  return (
    <>
      {/* Render the header */}
      <Header />
      <main>
        <Container maxWidth="lg" sx={{ mt: 10, mb: 2 }}>
          {/* Render the grid */}
          <Grid2 container spacing={4}>
            {/* Render the sidebar if the user is authenticated */}
            {isAuth && (
              <Grid2 md={3} sx={{ display: { xs: 'none', md: 'block' } }}>
                <Sidebar />
              </Grid2>
            )}
            {/* Render the main content */}
            <Grid2 xs={12} md={isAuth ? 9 : 12}>
              {children}
            </Grid2>
          </Grid2>
        </Container>
      </main>
      {/* Render the footer */}
      <Footer />
      {/* Render the analytics */}
      <Analytics debug={false} />
    </>
  )
}
