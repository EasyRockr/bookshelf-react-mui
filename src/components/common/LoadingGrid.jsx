import React from 'react'
import { Grid, Skeleton, Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { CARD_W, CARD_H, IMAGE_H } from '../../Styles/bookCard.sx.js'
import { gridWrapSx } from '../../Styles/loading.sx.js'

export default function LoadingGrid({
  count = 12,
  animation = 'pulse',
  fullCard = false,     
  itemProps = {},       
}) {
  const t = useTheme()
  const coverH = IMAGE_H
  const cardH = CARD_H

  return (
    <Grid container spacing={2} sx={gridWrapSx(t)}>
      {Array.from({ length: count }).map((_, i) => (
        <Grid item key={i} {...itemProps}>
          <Box sx={{ width: CARD_W }}>
            <Skeleton
              variant="rectangular"
              animation={animation}
              height={fullCard ? cardH : coverH}
              sx={{
                borderRadius: t.shape.borderRadius,
                ...(fullCard ? {} : {
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                }),
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
