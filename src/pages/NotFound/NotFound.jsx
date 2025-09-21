import React from 'react'
import { Box, Typography, Button } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

export default function NotFound() {
  const t = undefined

  return (
    <Box sx={notFoundWrap(t)}>
      <Typography variant='h5' gutterBottom>
        Page not found
      </Typography>
      <Button
        variant='contained'
        component={RouterLink}
        to='/trending'
      >
        Back to Trending
      </Button>
    </Box>
  )
}
