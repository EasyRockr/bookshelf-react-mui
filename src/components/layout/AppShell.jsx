import React from 'react'
import { Container, Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import AppNav from './AppNav.jsx'
import { appShellSx } from '../../Styles/layout.sx.js'

export default function AppShell({ children }) {
  const t = useTheme()

  return (
    <Box sx={appShellSx(t)}>
      <AppNav />
      <Container maxWidth="lg">
        {children}
      </Container>
    </Box>
  )
}
