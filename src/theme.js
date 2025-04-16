import { experimental_extendTheme as extendTheme } from '@mui/material/styles'
import { deepOrange, cyan, teal, orange } from '@mui/material/colors'

// Tạo một theme instance.
const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: teal,
        secondary: deepOrange
      }
    },

    dark: {
      palette: {
        primary: cyan,
        secondary: orange
      }
    }
  }
  // ...các thuộc tính khác
})

export default theme