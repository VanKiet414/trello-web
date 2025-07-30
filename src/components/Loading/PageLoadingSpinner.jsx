import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'

function PageLoadingSpinner({ caption = 'Loading...' }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        width: '100vw',
        height: '100vh'
      }}
      role="status"
      aria-live="polite"
    >
      <CircularProgress aria-label="Loading" />
      <Typography>{caption}</Typography>
    </Box>
  )
}

export default PageLoadingSpinner