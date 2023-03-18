// Import necessary modules from various libraries
import { FC } from 'react'
import { Box, Link, Typography } from '@mui/material'
import { BorderBox } from '../../ui/ThemeBox'
import { builtWithList } from './builtWithList'
import { useTranslation } from 'react-i18next'

// Define a React functional component named `About` using the `FC` type from React.
export const About: FC = () => {
  const { t } = useTranslation(['about']) // Get the `t` function for translating the text
  document.title = t('title1') // Set the title of the document using the translated text

  // Render the component
  return (
    <BorderBox sx={{ p: 3, mb: 2 }}>
      <Box display="flex" alignItems="center" justifyContent="center">
        {/* Render the logo */}
        <img
          src="/assets/images/logoappledrip.png"
          alt="Apple Drip"
          height="150px"
          width="150px"
          draggable={false}
        />
      </Box>
      {/* Render the title */}
      <Typography
        variant="h4"
        sx={{ fontWeight: '400', letterSpacing: 3, mb: 4 }}
        color="primary"
        textAlign="center"
      >
        APPLE DRIP
      </Typography>
      {/* Render the first line of the text */}
      <Typography>{t('line1')}</Typography>
      {/* Render the second line of the text */}
      <Typography sx={{ mt: 3 }}>{t('line2')}</Typography>
      {/* Render the list of items built with */}
      <ul>
        {builtWithList.map((item, index) => (
          <Link
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            underline="none"
            key={index}
          >
            <li>{item.title}</li>
          </Link>
        ))}
      </ul>
    </BorderBox>
  )
}
