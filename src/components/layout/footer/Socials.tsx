// Importing necessary dependencies and components
import { FC } from 'react'  // A type definition for functional components used in the application
import { IconButton, Stack } from '@mui/material'  // MUI components used for displaying social media links
import { socials } from './socialsList'  // A list of social media links and icons

// Defining a functional component for social media links
export const Socials: FC = () => {
  return (
    // A stack of IconButton components with horizontal layout and spacing
    <Stack justifyContent="center" direction="row" spacing={1}>
      {socials.map((social) => (
        <IconButton
          href={social.link}
          target="_blank"
          rel="noopener noreferrer"
          color="primary"
          key={social.link}
        >
          <social.icon />
        </IconButton>
      ))}
    </Stack>
  )
}
