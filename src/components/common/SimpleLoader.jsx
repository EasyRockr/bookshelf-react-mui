import React from 'react'
import { Box, CircularProgress } from '@mui/material'
import { spinnerRowSx, spinnerFullSx } from '../../Styles/loading.sx.js'
import { useTheme } from '@mui/material/styles'

export default function SimpleLoader({ full = false }) {
  const t = useTheme()
  return (
    <Box sx={full ? spinnerFullSx(t) : spinnerRowSx(t)}>
      <CircularProgress />
    </Box>
  )
}
