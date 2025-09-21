import React from 'react'
import { Box, Grid, Typography } from '@mui/material'
import BookCard from './BookCard.jsx'

export default function Section({ title, books = [], onOpen = () => {} }) {
  return (
    <Box sx={{ mb: 1 }}>
      {title && (
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>{title}</Typography>
      )}
      <Grid container spacing={2}>
        {books.map((b) => (
          <Grid
            item
            key={b.key || b.id}
            xs={12}
            sm={6}
            md={4}
            lg={2}
            xl={2}
          >
            <BookCard book={b} onClick={() => onOpen(b)} />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
