// Import necessary modules from various libraries
import { FC } from 'react'
import { Box } from '@mui/material'
import { Menu } from './menu/Menu'
import { UsersOnline } from './UsersOnline'

// Define a React functional component named `Sidebar` using the `FC` type from React.
export const Sidebar: FC = () => {
  // Render the sidebar
  return (
    <Box sx={{ position: 'sticky', top: '80px', mr: -2 }}>
      {/* Render the menu component */}
      <Menu />
      {/* Render the users online component */}
      <UsersOnline />
    </Box>
  )
}
