import React from 'react'
import { Box, CircularProgress } from '@mui/material'

export default function SimpleLoader() {
  return (
    <Box sx={{ display:'grid', placeItems:'center', py: 4 }}>
      <CircularProgress />
    </Box>
  )
}
