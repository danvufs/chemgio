import { Menu, MenuProps, styled } from '@mui/material'
export const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    backgroundColor: theme.palette.grey[100], // Updated background color
    borderRadius: '12px',
    border: '1px solid',
    borderColor: theme.palette.divider,
    marginTop: theme.spacing(3),
    minWidth: 200,
    color: theme.palette.text.primary,
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.35) 0px 10 px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
      transition: 'box-shadow 0.3s ease-in-out',
      '& .MuiMenu-list': {
      padding: '4px 0',
      },
      '& .MuiMenuItem-root': {
      '&:hover': {
      backgroundColor: theme.palette.grey[200], // Updated hover background color
      },
      '& .MuiSvgIcon-root': {
      fontSize: 28,
      color: theme.palette.secondary.main, // Updated icon color
      marginRight: theme.spacing(2),
      },
      },
      },
      }))
      
      
      
      
      