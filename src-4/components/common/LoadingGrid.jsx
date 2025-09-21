import React from 'react'
import { Grid, Skeleton } from '@mui/material'

export default function LoadingGrid({ count = 12, animation = 'wave' }) {
  return (
    <Grid container spacing={2} justifyContent="center">
      {Array.from({ length: count }).map((_, i) => (
        <Grid item key={i} xs={12} sm={6} md={4} lg={2} xl={2}>
          <Skeleton variant="rectangular" height={300} animation={animation} sx={{ borderRadius: 2 }} />
          <Skeleton height={24} animation={animation} sx={{ mt: 1, width: '80%' }} />
          <Skeleton height={18} animation={animation} sx={{ width: '60%' }} />
          <Skeleton height={18} animation={animation} sx={{ width: '50%' }} />
        </Grid>
      ))}
    </Grid>
  )
}
