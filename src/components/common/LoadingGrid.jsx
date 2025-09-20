// src/components/common/LoadingGrid.jsx
import React from 'react'
import { Grid, Skeleton, Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { CARD_W, CARD_H, IMAGE_H } from '../../Styles/bookCard.sx.js'
import { gridWrapSx } from '../../Styles/loading.sx.js'

export default function LoadingGrid({
  count = 12,
  animation = 'pulse',
  fullCard = false, // set true if you want a single big skeleton the size of the whole card
}) {
  const t = useTheme()
  const coverH = IMAGE_H
  const cardH = CARD_H

  return (
    <Grid container spacing={2} sx={gridWrapSx(t)}>
      {Array.from({ length: count }).map((_, i) => (
        <Grid item key={i}>
          <Box sx={{ width: CARD_W }}>
            <Skeleton
              variant="rectangular"
              animation={animation}
              height={fullCard ? cardH : coverH}
              sx={{
                borderRadius: t.shape.borderRadius,
                // If we’re only doing the image area, keep bottom corners square like the real card
                ...(fullCard
                  ? {}
                  : { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }),
              }}
            />
            {!fullCard && (
              <>
                <Skeleton sx={{ mt: 1 }} animation={animation} />
                <Skeleton width="60%" animation={animation} />
              </>
            )}
          </Box>
        </Grid>
      ))}
    </Grid>
  )
}
