import React, { useState } from 'react'
import { Box, Skeleton } from '@mui/material'

export default function LazyImg({ src, alt = '', sx = {}, height = '100%', width = '100%' }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <Box sx={{ position: 'relative', height, width }}>
      {!loaded && <Skeleton variant="rectangular" width="100%" height="100%" />}
      <Box
        component="img"
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: loaded ? 'block' : 'none', ...sx }}
      />
    </Box>
  )
}